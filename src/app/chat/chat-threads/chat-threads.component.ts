import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Thread } from "../thread.model";
import { ThreadService } from "../thread.service";
import { AuthService } from "../../services/auth.service";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HttpHeaders } from "@angular/common/http";
import { empty } from "rxjs/Observer";
import { CommonService } from "../../services/common.service";
import { responsiveService } from "../../services/responsive.service";

@Component({
  selector: "app-chat-threads",
  templateUrl: "./chat-threads.component.html",
  styleUrls: ["./chat-threads.component.css"],
})
export class ChatThreadsComponent implements OnInit {
  threads: Thread[];
  public user: any;
  public token: any;
  public threadsLoading: boolean;
  public showErrorModal: boolean;
  public isMobile: Boolean; //responsive checker

  constructor(
    public threadService: ThreadService,  
    private authService: AuthService, 
    private cmnService: CommonService,
    private responsiveService: responsiveService,
  ) {
    const jwtHelper = new JwtHelperService();
    this.token = authService.getToken();
    this.user = jwtHelper.decodeToken(this.token);
    this.user.profile_picture = authService.getImage();
    this.user.id = authService.getId();
    // localStorage.removeItem("threadSender");
  }
  
  ngOnInit() {
    //responsive checker
    this.onResize();
    this.responsiveService.checkWidth();

    this.threadsLoading = true;
    this.showErrorModal = false;

    this.threadService.getThreads().subscribe((data) => {
      this.threads = data.filter(
        thread => thread.lastMessage != null && !this.cmnService.chatDeleted(thread)
      );
      this.orderThredsOnLatestMessage();
      this.getSendersInfo();
    },
    (error) => {
      this.showErrorModal = true;
      // this.threadsLoading = false;
    });

    this.threadService.updateChatPageLastSeenTime();
  }

  //responsive checker
  onResize() {
    this.responsiveService.getMobileStatus().subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }

  orderThredsOnLatestMessage() {
    this.threads.sort((a,b) => 0 - (a.lastMsgTime > b.lastMsgTime ? 1 : -1))
  }

  getSendersInfo() {
    this.threadsLoading = true;

    // iterating over 2 members
    let payloads = [];
    this.threads.forEach(thread => {
      for (const [key, value] of Object.entries(thread.members)) {
        const senderId = key;
        if(senderId !== this.user.id){
          payloads.push({'sender_id':senderId, 'application_id': thread.id});
          break;
        }
      }
    });
    
    // get sender info
    if(payloads.length > 0){
      let tokenParsed = this.authService.getToken();
      let options = {
        headers: new HttpHeaders({ Authorization: "Bearer " + tokenParsed }),
      };
      this.threadService.getThreadsSendersInfo(payloads, options).subscribe(
        (response) => {
          const data = response["data"];
          this.threads.map(thread => {
            thread['sender'] = data[thread.id];
          });
          this.threads = this.threads.filter(thread => thread.sender != undefined);
          this.threadsLoading = false;
        },
        (error) => {
          if (error.status == 401 && error.statusText == "Unauthorized") {
            this.authService.tokenExpired();
          }
          else{
            this.showErrorModal = true;
          }
          // this.threadsLoading = false;
        }
      );
    }
    else{
      this.threadsLoading = false;
    }
  }
  
  // saveThreadSenderInfo(sender) {
  //   localStorage.setItem('threadSender', JSON.stringify(sender));
  // }
}
