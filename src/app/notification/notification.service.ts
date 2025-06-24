import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "angularfire2/firestore";
import * as firebase from 'firebase'

import {Subject} from 'rxjs/Subject';
import { AuthService } from '../services/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

import { Notification } from "./notification.model";
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../store';
import { ADD_NOTIFICATION } from './../actions';

@Injectable()
export class NotificationService {
  notifCollection: AngularFirestoreCollection<Notification>;

  private messaging = firebase.messaging();
  
  private messageSource = new Subject();
  currentMessage = this.messageSource.asObservable();

  public user: any;
  public token: any;

  constructor(
    private afs: AngularFirestore, 
    private authService: AuthService,
    private ngRedux: NgRedux<IAppState>,
  ) {
    if(authService.isLoggedIn()){
      const jwtHelper = new JwtHelperService();
      this.token = authService.getToken();
      this.user = jwtHelper.decodeToken(this.token);
      this.user.profile_picture = authService.getImage();
      this.user.id = authService.getId();
    }
  }

  // get permisssion to send messages
  getPermission() {
    this.messaging.requestPermission()
    .then(() => {
      // console.log('Notification permission granted.');
      return this.messaging.getToken()
    })
    .then(token => this.saveToken(token))
    .catch(err => console.log(err, 'Unable to get permission'))
  }

  // listen for token refresh
  monitorRefresh(){
    this.messaging.onTokenRefresh(() => {
      this.messaging.getToken()
        .then(refreshedToken => this.saveToken(refreshedToken))
        .catch(err => console.log(err, 'unable to retrive new token'))
    })
  }

  // used to show message when app is open
  receiveMessage(){
    this.messaging.onMessage((payload) => {
      // console.log('Message received. ', payload);
      this.messageSource.next(payload);
    })
  }

  // save the permission token in firestore
  private saveToken(token): void {
    let tokenParsed = this.authService.getToken();
    let options = {
      headers: new HttpHeaders({ Authorization: "Bearer " + tokenParsed }),
    };
    this.authService.getDeviceTokens(options).subscribe((response) => {
        const currentTokens = response['data'] || [];
    
        // if token does not exist in firestore, update db
        if(!this.hasToken(token, currentTokens)){
          let value = { token };
          this.authService.saveDeviceToken(value, options).subscribe((response)=>{});
        }
      }
    );
  }

  private hasToken(token, currentTokens){
     for(let item of currentTokens){
      if(item == token) 
        return true;
    };
    return false;
  }

  getNotifications() {
    let userId = this.user ? this.user.id : null;
    this.notifCollection = this.afs.collection(
      `notifications/${userId}/items`,
      (ref) => ref.orderBy("timestamp", 'desc')
    );
    return this.notifCollection.snapshotChanges();
  }

  getNotificationsById(userId) {
    this.notifCollection = this.afs.collection(
      `notifications/${userId}/items`,
      (ref) => ref.orderBy("timestamp")
    );
    return this.notifCollection.snapshotChanges();
  }
  
  saveNotification(notif: object) {
    const data = {
      // recipientId: notif['recipient_id'],
      title: notif['title'],
      body: notif['body'],
      clickAction: notif['click_action'],
      timestamp: new Date(),
      applicationId: notif['application_id'],
      isSeen: false
    }

    return this.afs
    .collection('notifications')
    .doc(`${notif['recipient_id']}`)
    .collection('items')
    .add(data)
    .then(() => {
      // console.log('notification saved');
      this.setNotifPageLastSeenTime(`${notif['recipient_id']}`)
    })
    .catch((error) => {
      // console.log(error.message)
    });
  }

  getNotifPageLastSeenTime() {
    const notifDoc = this.afs.doc<Notification>(`notifications/${this.user.id}`);
    return notifDoc.valueChanges(); 
  }

  setNotifPageLastSeenTime(recepientId: string) {
    this.getNotificationsById(recepientId).subscribe(items => {
      if(items.length == 1) {
        const data = {
          notifPageLastSeenTime: null
        };
    
        this.afs
        .collection('notifications')
        .doc(recepientId)
        .set(data, {merge: true});
      }
    });
  }

  updateNotifPageLastSeenTime() {
    const data = {
      notifPageLastSeenTime: new Date()
    };

    return this.afs
    .collection('notifications')
    .doc(this.user.id)
    .set(data, {merge: true});
  }

  updateNotifAsSeen(nid: string) {
    const notificationPath = `notifications/${this.user.id}/items/${nid}`;
    return this.afs.doc(notificationPath).set({isSeen: true}, {merge: true});
  }
  
  globalStoreOfNotifications() {
    this.getNotifications().subscribe((items) => {
      items.forEach(item => {
        const data = item.payload.doc.data();
        const notification = {
          id: item.payload.doc.id,
          title: data['title'],
          body: data['body'],
          clickAction: data['clickAction'],
          timestamp: data['timestamp'],
          applicationId: data['applicationId'],
          isSeen: data['isSeen']
        };
        
        this.ngRedux.dispatch({ 
          type: ADD_NOTIFICATION, 
          notification
        });
      });
    });
  }
}
