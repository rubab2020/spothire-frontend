import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  Input,
  EventEmitter,
  Output,
} from "@angular/core";
import { ThreadService } from "../thread.service";
import { Observable, Subscription } from "rxjs";
import { Thread } from "../thread.model";
import { Router, ActivatedRoute } from "@angular/router";
import { CommonService } from "../../services/common.service";
import { JwtHelperService } from "@auth0/angular-jwt";
import { AuthService } from "../../services/auth.service";
import { HttpHeaders } from "@angular/common/http";
import { Message } from "../message.model";
import { MessageService } from "../message.service";
import { responsiveService } from "../../services/responsive.service";

@Component({
  selector: "app-chat-detail",
  templateUrl: "./chat-detail.component.html",
  styleUrls: ["./chat-detail.component.css"],
})
export class ChatDetailComponent implements OnInit {
  @ViewChild("scroller") private feedScroller: ElementRef;
  @Input() viewType: string;
  @Input() popupSender: any;
  @Output() onClickCloseChat = new EventEmitter();

  threadId: string;
  sender: any;
  threadLoading: boolean;
  showErrorModal: boolean;
  defaultProfImg:any = "../assets/images/default_profile.png";
  messages: Message[];

  public user: any;
  public token: any;
  disableAutoScrollDown = false;

  msgsSubscription: Subscription;
  threadsSubscription: Subscription;

  public isMobile: Boolean; //responsive checker

  constructor(
    private el: ElementRef, 
    private threadService: ThreadService, 
    private router: Router,
    private cmnService: CommonService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private responsiveService: responsiveService,
  ) {
    const jwtHelper = new JwtHelperService();
    this.token = authService.getToken();
    this.user = jwtHelper.decodeToken(this.token);
    this.user.profile_picture = authService.getImage();
    this.user.id = authService.getId();
  }

  ngOnInit() {
    this.threadLoading = true;
    this.showErrorModal = false;

    if(this.popupSender){
      this.sender = this.popupSender;
      this.threadId = this.sender.application_id;
      this.getMessages();
    }
    else{
      this.threadId = this.route.snapshot.paramMap.get("threadId");
      const sid = this.route.snapshot.paramMap.get("senderId");
      this.sender = this.getSenderInfo(sid);
    }

    //responsive checker
    this.onResize();
    this.responsiveService.checkWidth();
  }

  //responsive checker
  onResize() {
    this.responsiveService.getMobileStatus().subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }

  ngOnDestroy() {
    if(!this.popupSender){
      this.threadsSubscription.unsubscribe();
    } 
    this.msgsSubscription.unsubscribe();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  public onScroll() {
    const feedName = this.viewType == 'popup' ? 'chat-feed-popup' : 'chat-feed';
    const element: any = this.el.nativeElement.querySelector("."+feedName);
    let atBottom = (element.scrollHeight - element.scrollTop) === element.clientHeight
    if (this.disableAutoScrollDown && atBottom) {
        this.disableAutoScrollDown = false
    } else {
        this.disableAutoScrollDown = true
    }
  }

  scrollToBottom(): void {
    if (this.disableAutoScrollDown) 
      return;

    const feedName = this.viewType == 'popup' ? 'chat-feed-popup' : 'chat-feed';
    const scrollPane: any = this.el.nativeElement.querySelector("."+feedName);
    scrollPane.scrollTop = scrollPane.scrollHeight;
  }

  getSenderInfo(senderId): void {
    let tokenParsed = this.authService.getToken();
    let options = {
      headers: new HttpHeaders({ Authorization: "Bearer " + tokenParsed }),
    };
    let payload = {'sender_id':senderId, 'application_id': this.threadId};
    this.threadsSubscription = this.threadService.getThreadSenderInfo(payload, options).subscribe(
      (response) => {
        this.sender = response["data"];
        this.getMessages();
      },
      (error) => {
        if (error.status == 401 && error.statusText == "Unauthorized") {
          this.authService.tokenExpired();
        }
        else{
          this.showErrorModal = true;
        }
      }
    );
  }

  deleteChat(viewType) {
    this.threadService.deleteThread(this.threadId);
    if(viewType == 'popup'){
     this.onClickCloseChat.emit();
    }
    else{
      this.goBack(this.viewType);
    }
  }
  
  goBack(viewType) {
    if(viewType == 'popup'){
     this.onClickCloseChat.emit();
    }
    else{
      this.router.navigate(["chat"]);
    }
  }

  getMessages() {
    this.msgsSubscription =  this.messageService.getMessages(this.threadId)
    .subscribe((messages) => {
      this.messages = messages.filter(
        message => !this.messageDeleted(message)
      );
      this.saveLastSeen();
      this.threadLoading = false;
    },
    (error) => {
      this.showErrorModal = true;
    });
  }

  messageDeleted(message) {
    return message.deletedByMembers 
      && message.deletedByMembers[this.user.id]
      ? true
      : false;
  }
 
  private saveLastSeen() {
    if(this.messages.length > 0) {
      const lastMsg = this.messages[this.messages.length - 1];
      this.messageService.saveLastSeenMessageTime(this.threadId, lastMsg);
    }
  }

  messageSent() {
    this.disableAutoScrollDown = false;
  }
}
