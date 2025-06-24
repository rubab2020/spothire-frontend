import { Component, OnInit } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import * as $ from "jquery";
import { AuthService } from "../../services/auth.service";
import { responsiveService } from "../../services/responsive.service";
import { SharedProfileService } from "../../services/shared-profile.service";
import { environment } from "../../../environments/environment";
import { ActivatedRoute } from "@angular/router";
import { ThreadService } from "../../chat/thread.service";
import { NgRedux, select } from '@angular-redux/store';
import { NotificationService } from "../../notification/notification.service";
import { Notification } from "../../notification/notification.model";

@Component({
  selector: "app-private-header",
  templateUrl: "./private-header.component.html",
  styleUrls: ["./private-header.component.css"],
})
export class PrivateHeaderComponent implements OnInit {
  @select() threadsUnseenMsgs;
  @select() stateNotifications;

  private INDV_NAME = environment.individualName;
  private COMP_NAME = environment.companyName;

  public isMobile: Boolean; //responsive checker
  public user: any;
  public token: any;
  public sectionName: string;
  defaultProfImg: any = "../assets/images/default_profile.png";
  defaultCoverPhoto: any = "../assets/images/default_cover.png";

  totalUnseenMsgs: number;
  totalUnseenNotifs: number;

  constructor(
    private responsiveService: responsiveService,
    public authService: AuthService,
    private activatedRoute: ActivatedRoute,
    public threadService: ThreadService,
    private notifService: NotificationService
  ) {
    this.getUser(authService);
    this.sectionName = this.getSectionName();
  }

  ngOnInit() {
    this.responsiveChecker();

    if(this.authService.isLoggedIn()){
      this.notifService.globalStoreOfNotifications();
      this.calcTotalUnseenNotifs();
  
      this.threadService.globalStoreOfChatUnreadMsgs();
      this.calcTotalUnseenMsgs();
    }
  }

  private getUser(authService: AuthService) {
    const jwtHelper = new JwtHelperService();
    this.token = this.authService.getToken();
    this.user = jwtHelper.decodeToken(this.token);
    this.user['name'] = localStorage.getItem('name');
    this.user['email'] = localStorage.getItem('email');
    this.user["profile_picture"] = authService.getImage();
  }

  private responsiveChecker() {
    this.onResize();
    this.responsiveService.checkWidth();
  }

  private onResize() {
    this.responsiveService.getMobileStatus().subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }

  openNav() {
    var x = window.matchMedia("(max-width: 1280px)");
    if (x.matches) {
      document.getElementById("mySidenav").style.width = "280px";
    } else {
      document.getElementById("mySidenav").style.width = "340px";
    }
    $("#overlay").fadeToggle("slow", "swing");
  }

  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    $("#overlay").fadeOut("slow");
  }

  getSectionName() {
    if (this.activatedRoute.snapshot.url[0].path == "work")
      return "work-dashboard";
    else if (this.activatedRoute.snapshot.url[0].path == "hire")
      return "hire-dashboard";
    else if (this.activatedRoute.snapshot.url[0].path == "settings")
      return "settings";
    else if (this.activatedRoute.snapshot.url[0].path == "profile")
      return "view-profile";
    else 
      return "no-dashboard";
  }

  getSettingsPageName() {
    return this.user.user_type == this.INDV_NAME
      ? "/settings/individual-settings"
      : "/settings/company-settings";
  }

  calcTotalUnseenMsgs() {
    this.threadsUnseenMsgs.subscribe(threads => {
      this.threadService.getChatPageLastSeenTime().subscribe(data => {
        this.totalUnseenMsgs = 0;
        threads.forEach(thread => {
          if(data && data['chatPageLastSeenTime']) {
            let fallenMessges = 0;
            thread.messages.forEach(message => {
              if(message.timestamp <= data['chatPageLastSeenTime'])
                fallenMessges++;
            });
            this.totalUnseenMsgs +=  thread.count - fallenMessges;    
          }
          else{
            this.totalUnseenMsgs +=  thread.count;
          }
        });
      });
    });
  }
  
  calcTotalUnseenNotifs() {
    this.stateNotifications.subscribe((notifications) => {
      this.notifService.getNotifPageLastSeenTime().subscribe(data => {
        this.totalUnseenNotifs = 0;
        notifications.forEach(notification => {
          if(data && data['notifPageLastSeenTime']) {
            if(notification['timestamp'] > data['notifPageLastSeenTime'])
              this.totalUnseenNotifs++;
          }
          else {
            this.totalUnseenNotifs++;
          }
        });
      });
      
    });
  }
}
