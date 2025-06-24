import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-write-offer-fields-err-modal',
  templateUrl: './write-offer-fields-err-modal.component.html',
  styleUrls: ['./write-offer-fields-err-modal.component.css']
})
export class WriteOfferFieldsErrModalComponent implements OnInit {
  @Output() onClick: EventEmitter<any> = new EventEmitter();
  
  constructor() { }

  ngOnInit() {
  }

  moveStepper(index: number) {
    this.onClick.emit(index);
  }

}
