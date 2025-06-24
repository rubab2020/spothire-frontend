import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { JobDetailsService } from "../../services/job-details.service";
import { AuthService } from "../../services/auth.service";
import { HttpHeaders } from "@angular/common/http";
import { ErrorHandlerService } from "../../services/error-handler.service";
import { responsiveService } from "../../services/responsive.service";
import { NgProgress } from "@ngx-progressbar/core";
import { isString } from "util";
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from "../../../environments/environment";
import { JobService } from "../../services/job.service";
import * as $ from "jquery";
import { ToastrService } from "ngx-toastr";
import { GoogleAnalyticsService } from "../../services/google-analytics.service";
import { CommonService } from "../../services/common.service";
declare var $: any;

@Component({
  selector: "app-job-details",
  templateUrl: "./job-details.component.html",
  styleUrls: ["./job-details.component.css"],
})
export class JobDetailsComponent implements OnInit {
  private APPLICATION_STATUSES = environment.applicationStatuses;
  private API_URL = environment.apiUrl;
  private INDV_NAME = environment.individualName;
  private COMP_NAME = environment.companyName;
  public baseUrl: string;

  public showErrorModal = false;
  public job: any = null;
  public backupJob: any = null;
  public isMobile: Boolean; //responsive checker
  isJobLoading = false;
  public showOverlay = false;

  errors = [];
  public showIndividual = true;
  public showCompany = false;

  public user: any;
  public token: any;

  public profile = null;
  public profiles = [];
  previewProfLoading = false;

  circleSpin = false;

  constructor(
    private route: ActivatedRoute,
    private jobService: JobService,
    private toastr: ToastrService,
    private router: Router,
    private service: JobDetailsService,
    private authService: AuthService,
    private errorHandler: ErrorHandlerService,
    private responsiveService: responsiveService,
    private googleAnalyticsService: GoogleAnalyticsService,
    public progress: NgProgress,
    private cmnService: CommonService
  ) {
    this.user = null;
    const jwtHelper = new JwtHelperService();
    this.token = this.authService.getToken();
    if (this.token) {
      this.user = jwtHelper.decodeToken(this.token);
    }
  }

  ngOnInit() {
    this.baseUrl = window.location.origin;
    this.progress.start();

    this.getJobDetails();

    //responsive checker
    this.onResize();
    this.responsiveService.checkWidth();
  }

  //responsive checker
  onResize() {
    this.responsiveService.getMobileStatus().subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }

  getJobDetails() {
    this.isJobLoading = true;
    this.route.paramMap.subscribe((params) => {
      let slug = params.get("slug");

      let token_parsed = this.authService.getToken();
      let options = {
        headers: new HttpHeaders({ Authorization: "Bearer " + token_parsed }),
      };
      let value = { slug: slug };
      let functionName = this.user ? "getJobDetails" : "getPublicJobDetails";
      this.service[functionName](value, options).subscribe(
        (response) => {
          this.progress.done();
          this.isJobLoading = false;
          this.job = response["data"];
          this.backupJob = { ...this.job };

          if (!this.job) {
            this.showOverlay = true;
          }
        },
        (error) => {
          this.isJobLoading = false;
          this.showErrorModal = this.errorHandler.errorHandleFunction(error);
        }
      );
    });
  }

  applyJob(job) {
    if (!this.user) {
      this.cmnService.removePublicActionsFromStorage();
      this.googleAnalyticsService.emitEvent("public/job-details", "apply", null, null);
      localStorage.setItem("pubApplyJobId", job.id);
    } else {
      this.circleSpin = true;
      this.googleAnalyticsService.emitEvent("job-details", "apply", null, null);

      let token_parsed = this.authService.getToken();
      let options = {headers: new HttpHeaders({ Authorization: "Bearer " + token_parsed }),};
      let id = job.id;
      this.jobService.postApplyJob({ id }, options).subscribe(
        (response) => {
          this.circleSpin = false;
          this.router.navigate(["work/applied"]);
          this.toastr.success("Applied Successfully!", "", {closeButton: true,});
        },
        (error) => {
          this.circleSpin = false;
          if (error.status == 400) {
            this.toastr.error(error.error.error.message, "Error", {
              closeButton: true,
            });
          }
          if (error.status == 401 && error.statusText == "Unauthorized") {
            this.authService.tokenExpired();
          }
        }
      );
    }
  }

  // note: data should be cached as worker may see save compnay detals for multiple jobs
  // note: same function in work-applied section
  showProfile(employerId) {
    this.profile = {};
    this.previewProfLoading = true;

    const query = "?excepts=phone";
    this.jobService.getPublicProfile(employerId, query).subscribe(
      (response) => {
        this.profile = response["data"];
        this.previewProfLoading = false;
      },
      (error) => {
        if (error.status == 400) {
          this.toastr.error(error.error.error.message, "Error", {
            closeButton: true,
          });
        }
      }
    );
  }

  getLogoCoverSectionClass() {
    return "logo-cover-section";
  }
}
