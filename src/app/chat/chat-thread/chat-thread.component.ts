import { Component, OnInit, Input } from "@angular/core";
import { Thread } from "../thread.model";
import { CommonService } from "../../services/common.service";
import { NgRedux, select } from '@angular-redux/store';

@Component({
  selector: "app-chat-thread",
  templateUrl: "./chat-thread.component.html",
  styleUrls: ["./chat-thread.component.css"],
})
export class ChatThreadComponent implements OnInit {
  @Input() thread: Thread;
  @select() threadsUnseenMsgs; // redux data

  UnseenMsgsCnt: number;
  defaultProfImg:any = "../assets/images/default_profile.png";

  constructor(public cmnService: CommonService) {
  }

  ngOnInit() {
    this.threadsUnseenMsgs.subscribe(items => {
      for(let item of items) {
        if(this.thread.id == item.tid){
          this.UnseenMsgsCnt = item.count;
          break;
        }
      }
    });
  }
}
