import { Component, OnInit, Input } from '@angular/core';
import { Notification } from "../notification.model";
import { CommonService } from "../../services/common.service";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  @Input() notification: Notification;

  defaultImg:any = "../assets/images/newspaper.png";

  constructor(public cmnService: CommonService) { }

  ngOnInit() {
  }

}
