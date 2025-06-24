import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from "angularfire2/firestore";

import { JwtHelperService } from "@auth0/angular-jwt";
import { AuthService } from "../services/auth.service";
import { Message } from "./message.model";
import { CommonService } from "../services/common.service";
import { HttpHeaders } from "@angular/common/http";

@Injectable()
export class MessageService {
  messageColelction: AngularFirestoreCollection<Message>;
  messageDoc: AngularFirestoreDocument<Message>;

  public user: any;
  public token: any;

  constructor(
    private afs: AngularFirestore, // Private authService: AuthService
    private cmnService: CommonService,
    private authService: AuthService,
  ) {
    // const jwtHelper = new JwtHelperService();
    // this.token = authService.getToken();
    // this.user = jwtHelper.decodeToken(this.token);

    const jwtHelper = new JwtHelperService();
    this.token = authService.getToken();
    this.user = jwtHelper.decodeToken(this.token);
    this.user.profile_picture = authService.getImage();
    this.user.id = authService.getId();
  }

  getMessages(threadId) {
    this.messageColelction = this.afs.collection(
      `chats/${threadId}/messages`,
      (ref) => ref.orderBy("timestamp")
    );
    return this.messageColelction.valueChanges();
  }

  sendMessage(threadId: string, senderId: string, content: string) {
    const message: Message = {
      senderId,
      content,
      timestamp: new Date(),
    };

    return this.afs
      .collection(`chats/${threadId}/messages`)
      .add(message)
      .then(() => {
        // console.log("Message sent");
        this.activateThreadIfDeletedChat(threadId);
        this.notifyUser(senderId, content);
      })
      .catch((error) => {
        // console.log(error.message)
      });
  }

  activateThreadIfDeletedChat(threadId) {
    this.afs.doc(`chats/${threadId}`).update({
      // deletedByMembers: firebase.firestore.FieldValue.delete() // delete is not working
      deletedByMembers: null // setting null to remove members
    });


    // bad approach but used it as the fielvievalue.delete in upar code did not work
    // const doc = this.afs.doc(`chats/${threadId}`);
    // doc.valueChanges().subscribe(thread => {
    //   thread['deletedByMembers']
    //   delete thread['deletedByMembers'];
    //   doc.set(thread)
    // });
    
  }

  notifyUser(senderId, content) {
    let tokenParsed = this.authService.getToken();
    let options = {
      headers: new HttpHeaders({ Authorization: "Bearer " + tokenParsed }),
    };
    this.authService.getReceiverDeviceTokens(senderId, options).subscribe((response) => {
      const currentTokens = response['data'] || [];
      if(currentTokens.length > 0) {
        const payload = {
          notification: {
            title: `${this.user.name} sent you a message`,
            body: content,
            icon: 'assets/images/favicon.jpg',
            click_action: window.location.href,
          },
          data : {
            open_url : window.location.href,
            notification_type: 'chat'
          },
          tokens: currentTokens
        };
        this.cmnService.sendNotification(payload);
      }
      else{
        // console.log('no recipient token found');
      }
    });
  }

  saveLastSeenMessageTime(threadId, lastMsg){
    const data = {
      lastSeenMsgTime : {
        [this.user.id] : lastMsg.timestamp
      }
    } 
    return this.afs.doc(`chats/${threadId}`).set(data, {merge: true});
  }
}
