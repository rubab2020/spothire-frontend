import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { JwtHelperService } from "@auth0/angular-jwt";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from "angularfire2/firestore";
import { environment } from '../../environments/environment';
import { HttpClient,HttpHeaders } from '@angular/common/http';

import { Thread } from "./thread.model";
import { Message } from "./message.model";

import { AuthService } from "../services/auth.service";
import { MessageService } from "./message.service";

import { NgRedux } from '@angular-redux/store';
import { IAppState } from "../store";
import { ADD_THREAD_UNSEEN_MSG_CNT } from './../actions';
import { Router } from "@angular/router";
import { CommonService } from "../services/common.service";

@Injectable()
export class ThreadService {
  threadsCollection: AngularFirestoreCollection<Thread>;
  threadDoc: AngularFirestoreDocument<Thread>;

  messages: Observable<Message[]>;

  public user: any;
  public token: any;
  private API_URL = environment.apiUrl;
  private threadsSendersInfoUrl = `${this.API_URL}/api/chat/threads/senders-info`;
  private threadSenderInfoUrl = `${this.API_URL}/api/chat/thread/sender-info`;
  threadIdFromUrl: string;

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
    private messageService: MessageService,
    private http:HttpClient,
    private ngRedux: NgRedux<IAppState>,
    private router: Router,
    private cmnService: CommonService
  ) {
    const jwtHelper = new JwtHelperService();
    this.token = authService.getToken();
    this.user = jwtHelper.decodeToken(this.token);
    this.user.profile_picture = authService.getImage();
    this.user.id = authService.getId();
  }

  getThreads() {
    this.threadsCollection = this.afs.collection(
      "chats", 
      // ref => ref.orderBy("msgTimestamp").where(`members.${this.user.id}`, '==', true)
      ref => ref.where(`members.${this.user.id}`, '==', true)
    );
    return this.threadsCollection.valueChanges();
  }

  getThread(applicationId: string) {
    this.threadDoc = this.afs.doc<Thread>(`chats/${applicationId}`);
    return this.threadDoc.valueChanges();
  }

  createThread(receiverId: string, applicationId: string) {
    const currentUserId = this.user.id;
    
    // const avatar = this.user.profile_picture;
    const id = applicationId;
    const creatorId = currentUserId;
    const lastMessage = null;
    const lastMsgTime = null;
    const members = { [receiverId]: true, [currentUserId]: true };
    const lastSeenMsgTime = { [receiverId]: null, [currentUserId]: null };

    const thread: Thread = {
      id, 
      creatorId, 
      lastMessage, 
      lastMsgTime, 
      members, 
      lastSeenMsgTime, 
    };
    const threadPath = `chats/${id}`;
    
    return this.afs.doc(threadPath).set(thread, {merge: true});
  }

  saveLastMessage(threadId, message) {
    const data = {
      lastMessage: message,
      lastMsgTime: new Date()
    };
    return this.afs.doc(`chats/${threadId}`).set(data, {merge: true});
  }

  async deleteThread(threadId: string) {
    const batch = this.afs.firestore.batch();
    const query = await this.afs.collection(`chats/${threadId}/messages`).ref.get();
    query.forEach(doc => {
      const msg = doc.data();
      if(this.isSecondMemberDeletedMsg(msg, this.user.id)) {
        batch.delete(doc.ref);
        // console.log('delete msg');
      }
      else {
        const data = {
          deletedByMembers: {[this.user.id]: true}
        }
        batch.set(doc.ref, data, {merge: true});
        // console.log('update msg');
      }
    });

    batch.commit().then(() => {
      const data = {
        deletedByMembers: {[this.user.id]: true}
      };
      return this.afs.doc(`chats/${threadId}`).set(data, {merge: true});
      // console.log('all operation done');
    })
  }

  isSecondMemberDeletedMsg(msg, userId) {
    if(
      msg.deletedByMembers 
      && Object.keys(msg.deletedByMembers).length == 1 
      && msg.deletedByMembers[userId] == undefined
    ) {
      return true;
    }
 
    return false;
  }
  // this implementaion is wrong.. messages wont be deleted 
  // rather stop seeing those msg by setting flag for that partical user
  async clearHistory(threadId: string) {
    // const batch = this.afs.firestore.batch();
    // const query = await this.afs.collection(`chats/${threadId}/messages`).ref.get();

    // query.forEach(doc => {
    //   batch.delete(doc.ref);
    // });
  }

  getThreadsSendersInfo(value, options){
    return this.http.post(this.threadsSendersInfoUrl, value,options);
  }

  getThreadSenderInfo(value, options) {
    return this.http.post(this.threadSenderInfoUrl, value,options);
  }

  globalStoreOfChatUnreadMsgs(): void {
    this.getThreads().subscribe((data) => {
      this.setThreadIdFromUrl();
      const threads = data.filter(
        thread => thread.lastMessage != null && !this.cmnService.chatDeleted(thread)
      );
      threads.forEach(thread => {
        this.globalStoreThreadUnSeenMsgsCount(thread);
      });
    });
  }

  globalStoreThreadUnSeenMsgsCount(thread: Thread) : void {
    if(thread.lastSeenMsgTime && thread.lastSeenMsgTime.hasOwnProperty(this.user.id)){
      const currUserLastSeenMsgTime = thread.lastSeenMsgTime[this.user.id];
      const messagesPath = `chats/${thread.id}/messages`;
      const messageColelction = currUserLastSeenMsgTime 
        ? this.afs.collection(
            messagesPath,
            ref => ref.orderBy("timestamp").startAfter(currUserLastSeenMsgTime)
          ).valueChanges()
        : this.afs.collection(
            messagesPath,
            ref => ref.orderBy("timestamp")
          ).valueChanges();

      messageColelction.subscribe(messages => {
        if(this.threadIdFromUrl) {
          messages = messages.filter(
            message => this.isChatThreadNotOpen(thread, message) 
          );
        }
        this.ngRedux.dispatch({ 
          type: ADD_THREAD_UNSEEN_MSG_CNT, 
          threadUnseenMsgs: {tid: thread.id , count: messages.length, messages}
        });
      });
    }
    else{
      // int count
      this.ngRedux.dispatch({ 
        type: ADD_THREAD_UNSEEN_MSG_CNT, 
        threadUnseenMsgs: {tid: thread.id , count: 0, messages: {}}
      });
    }
  }

  setThreadIdFromUrl(): void {
    const threadIdSegmentIndex = 2;
    this.threadIdFromUrl = this.router.url.split('/')[threadIdSegmentIndex];
  }

  isChatThreadNotOpen(thread, message) {
    return this.threadIdFromUrl != thread.id 
      && message['senderId'] != this.user.id 
      ? true 
      : false;
  }

  getChatPageLastSeenTime() {
    const doc = this.afs.doc(`chatPageVisit/${this.user.id}`);
    return doc.valueChanges(); 
  }

  updateChatPageLastSeenTime() {
    const data = {
      chatPageLastSeenTime: new Date()
    };
    return this.afs.doc(`chatPageVisit/${this.user.id}`).set(data, {merge: true});
  }
}
