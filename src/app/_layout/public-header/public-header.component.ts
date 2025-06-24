import { Component, OnInit } from '@angular/core';
import { responsiveService } from '../../services/responsive.service';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-public-header',
  templateUrl: './public-header.component.html',
  styleUrls: ['./public-header.component.css']
})
export class PublicHeaderComponent implements OnInit {
  //responsive checker
  public isMobile: Boolean;

  public currentUrl: string = "";

  constructor(    private responsiveService: responsiveService, 
    private router: Router,
    private cmnService: CommonService) { }

  ngOnInit() {
    this.currentUrl = this.router.url;

    // subscribe needed when uri changed but componet not refresing for same route path with different params or sub links
    this.router.events.subscribe((event) => {
      this.currentUrl = this.router.url;
    });

    //responsive checker
    this.onResize();
    this.responsiveService.checkWidth();
  }

  onResize() {
    //responsive checker
    this.responsiveService.getMobileStatus().subscribe(isMobile => {
    this.isMobile = isMobile;
  });
}

}
