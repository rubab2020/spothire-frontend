import { Component, OnInit, Input } from "@angular/core";

import { Message } from "../message.model";
import { JwtHelperService } from "@auth0/angular-jwt";
import { AuthService } from "../../services/auth.service";
import { MessageService } from "../message.service";

@Component({
  selector: "app-chat-message",
  templateUrl: "./chat-message.component.html",
  styleUrls: ["./chat-message.component.css"],
})
export class ChatMessageComponent implements OnInit {
  @Input() message: Message;

  public user: any;
  public token: any;
  incoming: boolean;

  constructor(
    private messageService: MessageService,
    private authService: AuthService
  ) {
    const jwtHelper = new JwtHelperService();
    this.token = authService.getToken();
    this.user = jwtHelper.decodeToken(this.token);
    this.user.profile_picture = authService.getImage();
    this.user.id = authService.getId();
  }

  ngOnInit() {
    this.checkInComing();
  }

  checkInComing() {
    if(this.message.senderId && this.user.id) {
      this.incoming = this.message.senderId != this.user.id;
    }
  }
}
