import { ErrorHandlerService } from "./../../services/error-handler.service";
import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { HttpHeaders } from "@angular/common/http";
import { WorkDashboardService } from "../../services/work-dashboard.service";
import { UNIQUE_SELECTION_DISPATCHER_PROVIDER } from "@angular/cdk/collections";
import { HostListener } from "@angular/core";
import { NgProgress } from "@ngx-progressbar/core";
import { HireDashboardService } from "../../services/hire-dashboard.service";
import * as $ from "jquery";
declare var $: any;
import {
  trigger,
  state,
  style,
  animate,
  transition,
  group,
} from "@angular/animations";
import { GoogleAnalyticsService } from "../../services/google-analytics.service";
import { responsiveService } from "../../services/responsive.service";
import { JobService } from "../../services/job.service";
import { ToastrService } from "ngx-toastr";
import { isString } from "util";
import { environment } from "../../../environments/environment";
import {
  SwiperComponent,
  SwiperDirective,
  SwiperConfigInterface,
  SwiperScrollbarInterface,
  SwiperPaginationInterface,
} from "ngx-swiper-wrapper";
import { Observable, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { CommonService } from "../../services/common.service";
import { select } from "@angular-redux/store";
import { ThreadService } from "../../chat/thread.service";
import { AngularFirestore } from "angularfire2/firestore";
import { JwtHelperService } from "@auth0/angular-jwt";
import { NotificationService } from "../../notification/notification.service";

@Component({
  selector: "app-work-applied",
  templateUrl: "./work-applied.component.html",
  styleUrls: ["./work-applied.component.css"],
  animations: [
    trigger("listAnimation", [
      transition(":leave", [
        group([
          animate("150ms ease-in-out", style({ opacity: "0", height: 0 })),
        ]),
      ]),
    ]),
  ]
})
export class WorkAppliedComponent implements OnInit {
  @select() threadsUnseenMsgs;

  searchTermChanged: Subject<string> = new Subject<string>();

  private INDV_NAME = environment.individualName;
  private COMP_NAME = environment.companyName;
  private APPLICATION_STATUSES = environment.applicationStatuses;
  private WORK_APPLIED_SECTION = environment.sectionNames.WORK_APPLIED_SECTION;
  private WORK_HIRED_SECTION = environment.sectionNames.WORK_HIRED_SECTION;

  public isMobile: Boolean; //responsive checker

  defaultProfImg: any = "../assets/images/default_profile.png";
  defaultCoverPhoto: any = "../assets/images/default_cover.png";
  defaultCompImg: any = "../assets/images/default_company.png";
  defaultEducationImg: any = "../assets/images/default-education.png";
  defaultAwardImg: any = "../assets/images/default_award.png";

  allApplications = [];
  public applications;
  public selectedApplication = null; // selected application
  public profile = null;
  public profiles = [];

  public showErrorModal = false;
  public noDataFound = false;

  public showMsgBtn = false;
  chatNotifications = [];
  notifUniqueApplicationsIds = [];
  statusOfAllApplications = [];
  isChatPopupVisible = false;
  hasWorkAppliedSectionNotif = false;
  hasWorkHiredSectionNotif = false;


  Object = Object;
  circleSpin = false;
  public applicationsLoading = false;
  previewProfLoading = false;

  public user: any;
  public token: any;
  public profilePicture: string;
  public coverPhoto: string;

  public config: SwiperConfigInterface = {
    a11y: true,
    direction: "horizontal",
    slidesPerView: "auto",
    keyboard: true,
    mousewheel: true,
    scrollbar: false,
    navigation: false,
    pagination: true,
  };

  constructor(
    private responsiveService: responsiveService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private errorHandler: ErrorHandlerService,
    public progress: NgProgress,
    private service: WorkDashboardService,
    private authService: AuthService,
    private jobService: JobService,
    private toastr: ToastrService,
    private hireService: HireDashboardService,
    private cmnService: CommonService,
    private threadService: ThreadService,
    private notifService: NotificationService,
    private afs: AngularFirestore,
  ) {
    const jwtHelper = new JwtHelperService();
    this.token = this.authService.getToken();
    this.user = jwtHelper.decodeToken(this.token);
    this.user.cover_photo = authService.getCoverPhoto();
    this.user.profile_picture = authService.getImage();
    this.user.id = authService.getId();
  }

  ngOnInit() {
    this.progress.start();

    this.getAppliedjobsData();

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

  ngOnDestroy() {
    this.progress.done();
  }
  
  getAppliedjobsData() {
    this.applicationsLoading = true;

    let token_parsed = this.authService.getToken();
    let options = {
      headers: new HttpHeaders({ Authorization: "Bearer " + token_parsed }),
    };
    let value: any;
    this.service.getAppliedJobs(value, options).subscribe(
      (response) => {
        this.progress.done();

        this.applicationsLoading = false;

        if (response["data"].length == 0) {
          this.noDataFound = true;
        } else {
          setTimeout(() => {
            this.previewJob(0);

            $('.application').removeClass("selected");
            $('#application' + 0).addClass("selected");
          }, 0);
        }

        this.applications = response["data"];
        this.allApplications = [...this.applications];

        // this.getActiviesAndChatNotifications();
      },
      (error) => {
        this.showErrorModal = this.errorHandler.errorHandleFunction(error);
        this.applicationsLoading = false;
      }
    );
  }

  previewJob(index) {
    this.isChatPopupVisible = false;
    this.selectedApplication = this.applications[index];
    
    this.showMsgBtn = false;
    if (this.selectedApplication.application_status == this.APPLICATION_STATUSES.interviewed) {
      this.showMsgBtn = true;
    }

    $(".job-details").hide();
    $(".job-details").fadeIn(600);
    
    $('.application').removeClass("selected");
    $('#application' + index).addClass("selected");

    return false;
  }

  previewJobOnPopup(event, application, index) {
    this.selectedApplication = this.applications[index];
    
    this.showMsgBtn = false;
    if (this.selectedApplication.application_status == this.APPLICATION_STATUSES.interviewed) {
      this.showMsgBtn = true;
    }
  }

  // note: data should be cached as worker may see save compnay detals for multiple jobs
  // note: same function in job circular section
  // also in write offer
  previewProfile(employerId) {
    this.profile = {};
    this.previewProfLoading = true;

    if (this.profiles[employerId]) {
      this.profile = this.profiles[employerId];
      this.previewProfLoading = false;
      $("#previewProfileModal").modal("show");
      return;
    }

    let token_parsed = this.authService.getToken();
    let options = {
      headers: new HttpHeaders({ Authorization: "Bearer " + token_parsed }),
    };
    const query =
      this.selectedApplication.application_status ==
      this.APPLICATION_STATUSES.interviewed
        ? ""
        : "?excepts=phone";
    this.jobService.getProfile(employerId, query, options).subscribe(
      (response) => {
        this.profile = response["data"];
        this.profiles[employerId] = response["data"];
        this.profile = this.profiles[employerId];
        this.previewProfLoading = false;

        $("#previewProfileModal").modal("show");
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

  confirmWithdraw() {
    this.circleSpin = true;

    //google analytics
    this.googleAnalyticsService.emitEvent(
      "work/applied",
      "withdraw-job",
      null,
      null
    );

    let token_parsed = this.authService.getToken();
    let options = {
      headers: new HttpHeaders({ Authorization: "Bearer " + token_parsed }),
    };
    let application_id = this.selectedApplication["id"];
    this.service.postWithdraw({ application_id }, options).subscribe(
      (response) => {
        this.circleSpin = false;

        //remove applicant
        let index = this.applications
          .map((obj) => obj.id)
          .indexOf(this.selectedApplication["id"]);
        this.applications.splice(index, 1);

        // hide modal
        setTimeout(function () {
          $(".modal").modal("hide"); // closes all active pop ups.
          $(".modal-backdrop").remove(); // removes the grey overlay.
        }, 100);

        this.toastr.success("Withdrawn Successfully!", "", {
          closeButton: true,
        });
      },
      (error) => {
        this.circleSpin = false;

        if (error.status == 400) {
          this.toastr.error(
            "Something went wrong. Please try again.",
            "Error",
            {
              closeButton: true,
            }
          );
        }
        if (error.status == 401 && error.statusText == "Unauthorized") {
          this.authService.tokenExpired();
        }
      }
    );
  }

  onSearchChange(event) {
    if (this.searchTermChanged.observers.length === 0) {
      this.searchTermChanged
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe((query) => {
          this.updateSearch(query);
        });
    }
    this.searchTermChanged.next(event);
  }

  updateSearch(query) {
    this.applicationsLoading = true;
    this.noDataFound = false;

    // showing loaedr for 500ms
    setTimeout(() => {
      this.applicationsLoading = false;
      this.applications = [...this.allApplications];

      for (let key in this.applications) {
        if (
          !this.applications[key]["job"]["job_title"]
            .toLowerCase()
            .includes(query) &&
          !this.applications[key]["job"]["employer"]["name"]
            .toLowerCase()
            .includes(query)
        ) {
          this.applications.splice(key);
        }
      }

      if (this.applications.length == 0) {
        this.noDataFound = true;
      }
    }, 300);
  }

  moveApplicantToTopInJob(jobIndex) {
    let fromIndex = jobIndex;
    let toIndex = 0;
    let element = this.applications[jobIndex];
    this.applications.splice(fromIndex, 1);
    this.applications.splice(toIndex, 0, element);
  }

  getLogoCoverSectionClass() {
    return this.selectedApplication &&
      this.selectedApplication.application_status ==
        this.APPLICATION_STATUSES.interviewed
      ? "logo-cover-section-with-phn"
      : "logo-cover-section";
  }

    // ----------- chat ------------
  // also in work applied
  getMsgSenderInfo(phone) {
    return {
      application_id: this.selectedApplication.id,
      id: this.selectedApplication.job.employer.id,
      name: this.selectedApplication.job.employer.name,
      profile_pic: this.selectedApplication.picture,
      job_title: this.selectedApplication.job.job_title,
      application_status: this.selectedApplication.is_job_completed 
                            ? environment.applicationStatuses.completed
                            : environment.applicationStatuses.assigned,
      phone: phone
    }
  }
  
  // also in work applied
  chat(receiverId: string, applicationId: string) {
    this.isChatPopupVisible = true;
    
    return this.threadService.getThread(applicationId)
    .subscribe((data) => {
      if(data == null){
        return this.threadService.createThread(receiverId, applicationId)
        .then(() => {
          // console.log('Thread Created!')
        })
        .catch(error => console.log(error));
      }
      else{
        // console.log('Thread already exist')
      }
    },
    (error) => {
      console.log(error)
    });
  }

  // also in work applied
  closeChat(){
    this.isChatPopupVisible = false;
  }
}
