import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-job-share',
  templateUrl: './job-share.component.html',
  styleUrls: ['./job-share.component.css']
})
export class JobShareComponent implements OnInit {
  public baseUrl: string;
  @Input() job: any; 

    constructor(public cmnService: CommonService) { 
    this.baseUrl = window.location.origin;
  }

  ngOnInit() {
  }

}
