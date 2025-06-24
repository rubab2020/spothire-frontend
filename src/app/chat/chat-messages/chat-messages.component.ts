import { Component, OnInit, Input } from "@angular/core";
import { Observable } from "rxjs";

import { Message } from "../message.model";
import { MessageService } from "../message.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-chat-messages",
  templateUrl: "./chat-messages.component.html",
  styleUrls: ["./chat-messages.component.css"],
})
export class ChatMessagesComponent implements OnInit {
  @Input() messages: Message[];
  @Input() threadId: string;
  showMessages: boolean;

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {}
}
