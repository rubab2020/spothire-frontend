import { Component, OnInit } from '@angular/core';
import { Notification } from '../notification.model';
import { CommonService } from "../../services/common.service";
import { responsiveService } from "../../services/responsive.service";
import { NotificationService } from '../notification.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[];

  public notifsLoading: boolean;
  public showErrorModal: boolean;
  public isMobile: Boolean; //responsive checker
  
  constructor(
    private cmnService: CommonService,
    private responsiveService: responsiveService,
    private notifService: NotificationService
  ) { }

  ngOnInit() {
    //responsive checker
    this.onResize();
    this.responsiveService.checkWidth();

    this.notifsLoading = true;
    this.showErrorModal = false;

    this.notifService.getNotifications().subscribe((items) => {
      this.notifications = [];
      items.forEach(item => {
        const data = item.payload.doc.data();
        const notif = {
          id: item.payload.doc.id,
          title: data['title'],
          body: data['body'],
          clickAction: data['clickAction'],
          timestamp: data['timestamp'],
          applicationId: data['applicationId'],
          isSeen: data['isSeen']
        }
        this.notifications.push(notif);
      });
      this.notifsLoading = false;
    },
    (error) => {
      this.showErrorModal = true;
    });

    this.notifService.updateNotifPageLastSeenTime();
  }

    //responsive checker
    onResize() {
      this.responsiveService.getMobileStatus().subscribe((isMobile) => {
        this.isMobile = isMobile;
      });
    }

    getRouterLink(url: string): string {
      return new URL(url).pathname;
    }

    markNotifAsSeen(notification) {
      if(!notification.isSeen){
        this.notifService.updateNotifAsSeen(notification.id);
      }
    }
}
