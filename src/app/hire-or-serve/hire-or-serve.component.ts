import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleAnalyticsService } from '../services/google-analytics.service';
import * as $ from "jquery";
declare var $ : any;

@Component({
  selector: 'app-hire-or-serve',
  templateUrl: './hire-or-serve.component.html',
  styleUrls: ['./hire-or-serve.component.css']
})
export class HireOrServeComponent implements OnInit {

  constructor(private googleAnalyticsService: GoogleAnalyticsService, private router: Router) { }

  ngOnInit() {
    $('.modal').modal('hide');
    $('.modal-backdrop').remove();
  }

  handleHireOrServeEvent = (eventName) => {
    this.googleAnalyticsService.emitEvent("hire-serve", eventName, null, null);
  }  

}
