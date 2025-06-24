import { Component, OnInit,Input } from '@angular/core';
import * as $ from "jquery";
declare var $ : any;

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.css']
})
export class ErrorModalComponent implements OnInit {
  
  constructor() { }

  ngOnInit() {
    $("#errorModal").modal({backdrop: 'static', keyboard: false});
  }
  
  reloadRoute(){
    $("#errorModal").hide();
    window.location.reload();
  }
  
}
