import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpHeaders } from "@angular/common/http";
import { AuthService } from "../services/auth.service";
import { JwtHelperService } from "@auth0/angular-jwt";
import { ToastrService } from "ngx-toastr";
import { environment } from "../../environments/environment";
import { responsiveService } from "../services/responsive.service";
import { WriteOfferService } from "../services/write-offer.service";
import { JobService } from "../services/job.service";
import { CommonService } from "../services/common.service";
import { FavouriteService } from "../services/favourite.service";
import { RegistrationService } from "../services/registration.service";
import * as $ from "jquery";
declare var $: any;

@Component({
  selector: "app-welcome",
  templateUrl: "./welcome.component.html",
  styleUrls: ["./welcome.component.css"],
})
export class WelcomeComponent implements OnInit {
  private API_URL = environment.apiUrl;
  private INDV_NAME = environment.individualName;
  private COMP_NAME = environment.companyName;
  public isMobile: Boolean; //responsive checker
  public showIndividual = true;
  public showCompany = false;
  public token: any;

  constructor(
    private responsiveService: responsiveService,
    private writeOfferService: WriteOfferService,
    private jobService: JobService,
    private cmnService: CommonService,
    private favouriteService: FavouriteService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private regService: RegistrationService
  ) {}

  ngOnInit() {
    //responsive checker
    this.onResize();
    this.responsiveService.checkWidth();

    $(".modal").modal("hide");
  }

  //responsive checker
  onResize() {
    this.responsiveService.getMobileStatus().subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }
}
