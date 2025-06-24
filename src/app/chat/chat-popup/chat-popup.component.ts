import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-chat-popup',
  templateUrl: './chat-popup.component.html',
  styleUrls: ['./chat-popup.component.css']
})
export class ChatPopupComponent implements OnInit {
  @Input() popupSender: any;
  @Output() onClickCloseChat = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  closeChat(){
    this.onClickCloseChat.emit();
  }

}
