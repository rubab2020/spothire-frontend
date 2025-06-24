import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../../services/auth.service';
import * as $ from "jquery";
declare var $: any;

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {
  public user: any;
  public token: any;
  
  constructor(
    private authService: AuthService,
  ) { 
    this.user = null;
    const jwtHelper = new JwtHelperService();
    this.token = this.authService.getToken();
    if (this.token) {
      this.user = jwtHelper.decodeToken(this.token);
    }
  }

  ngOnInit() {
    $(".modal").modal("hide");
  }

}
