import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MessageService } from "../message.service";
import { JwtHelperService } from "@auth0/angular-jwt";
import { ThreadService } from "../thread.service";

@Component({
  selector: "app-chat-input",
  templateUrl: "./chat-input.component.html",
  styleUrls: ["./chat-input.component.css"],
})
export class ChatInputComponent implements OnInit {
  @Input() threadId: string;
  @Input() senderId: string;
  @Output() onMessageSend: EventEmitter<any> = new EventEmitter();


  message: string;

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private threadService: ThreadService
  ) {
  }

  ngOnInit() {}

  send(): void {
    let threadId = this.route.snapshot.paramMap.get("threadId");
    if(!threadId){
      threadId = this.threadId;
    }
    const message = this.message;
    if(message.length > 0) {
      this.messageService.sendMessage(threadId, this.senderId, message);
      this.saveLast(threadId, message);
    }
    this.message = "";
    this.onMessageSend.emit();
  }

  saveLast(threadId,  message) {
    this.threadService.saveLastMessage(threadId, message);
  }

  handleSubmit(event) {
    if (event.keyCode === 13) {
      this.send();
    }
  }
}