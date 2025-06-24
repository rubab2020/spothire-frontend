import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-job-card',
  templateUrl: './job-card.component.html',
  styleUrls: ['./job-card.component.css']
})
export class JobCardComponent implements OnInit {
  @Input() job: any;
  @Input() jobsSeen: any;
  @Output() onClickFavourite: EventEmitter<any> = new EventEmitter();
  @Output() onClickUnFavourite: EventEmitter<any> = new EventEmitter();

  defaultProfImg: any = "../assets/images/default_profile.png";

  constructor(public cmnService: CommonService) { }

  ngOnInit() {
  }

  favouriteJob(id) {
    this.onClickFavourite.emit(id);
  }

  unfavouriteJob(id) {
    this.onClickUnFavourite.emit(id);
  }
}
