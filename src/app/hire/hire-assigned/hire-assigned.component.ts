import { ErrorHandlerService } from "./../../services/error-handler.service";
import { StarRatingComponent } from "./../star-rating/star-rating.component";
import { Component, OnInit, EventEmitter, Input, Output } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { HireDashboardService } from "../../services/hire-dashboard.service";
import { HttpHeaders } from "@angular/common/http";
import { HostListener } from "@angular/core";
import * as $ from "jquery";
declare var $: any;
import { NgProgress } from "@ngx-progressbar/core";
import { GoogleAnalyticsService } from "../../services/google-analytics.service";
import { responsiveService } from "../../services/responsive.service";
import { ToastrService } from "ngx-toastr";
import { environment } from "../../../environments/environment";
import { CommonService } from "../../services/common.service";
import { Observable, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, take } from "rxjs/operators";
import { select } from "@angular-redux/store";
import { ThreadService } from "../../chat/thread.service";
import { NotificationService } from "../../notification/notification.service";
import { AngularFirestore } from "angularfire2/firestore";
import { JwtHelperService } from "@auth0/angular-jwt";

@Component({
  selector: "app-hire-assigned",
  templateUrl: "./hire-assigned.component.html",
  styleUrls: ["./hire-assigned.component.css"],
})
export class HireAssignedComponent implements OnInit {
  @select() threadsUnseenMsgs;
  searchTermChanged: Subject<string> = new Subject<string>();

  public INDV_NAME = environment.individualName;
  public COMP_NAME = environment.companyName;
  public RATING_STATUSES = environment.ratingStatuses;
  public HIRE_APPLIED_SECTION = environment.sectionNames.HIRE_APPLIED_SECTION;
  public HIRE_HIRED_SECTION = environment.sectionNames.HIRE_HIRED_SECTION;

  hasHireAppliedSectionNotif = false;
  hasHireHiredSectionNotif = false;
  
  public jobs: any;
  public allJobs: any;
  public selectedJob: any;

  public showLoaderProfile = false;
  public profileApiCall = true;
  public profiles = [];
  public selectedEmployee: any;
  public employeeProfile = null;

  rating: number = 0;

  public isMobile: Boolean; //responsive checker
  circleSpinDiscontinue = false;
  circleSpinComplete = false;

  public showErrorModal = false;
  public noDataFound = false;
  public applicationsLoading = false;

  defaultProfImg: any = "../assets/images/default_profile.png";
  defaultCoverPhoto: any = "../assets/images/default_cover.png";
  defaultCompImg: any = "../assets/images/default_company.png";
  defaultEducationImg: any = "../assets/images/default-education.png";
  defaultAwardImg: any = "../assets/images/default_award.png";
  noPhone: string = "../assets/images/no-phone.png";

  chatNotifications = [];
  notifUniqueApplicationsIds = [];
  statusOfAllApplications = [];
  isChatPopupVisible = false;

  public user: any;
  public token: any;
  public profilePicture: string;
  public coverPhoto: string;

  constructor(
    private responsiveService: responsiveService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private errorHandler: ErrorHandlerService,
    public progress: NgProgress,
    private authService: AuthService,
    private hdService: HireDashboardService,
    private toastr: ToastrService,
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
    
    this.getHireAssignedData();

    //responsive checker
    this.onResize();
    this.responsiveService.checkWidth();

    $(".modal").modal("hide");

  }

  ngOnDestroy() {
    this.progress.done();
  }

  //responsive checker
  onResize() {
    this.responsiveService.getMobileStatus().subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }


  getHireAssignedData() {
    this.applicationsLoading = true;

    let tokenParsed = this.authService.getToken();
    let options = {headers: new HttpHeaders({ Authorization: "Bearer " + tokenParsed })};
    let value = [];
    this.hdService.getHireAssignedData(value, options).subscribe(
      (response) => {
        this.progress.done();

        this.applicationsLoading = false;

        this.noDataFound = true;
        for(let i in response["data"]) {
          if(response["data"][i].employees.length > 0) {
            this.noDataFound = false; 
            break; 
          }
        }

        if(!this.noDataFound) {
          setTimeout(() => {
            for (let i in response["data"]){
              if(response["data"][i].employees.length > 0){
                this.previewEmployeeProfile(
                  response["data"][i].employees[0]['id'], 0, 0);
                break;
              }
            }
          }, 0);
        }

        this.jobs = response["data"];
        this.allJobs = this.cmnService.cloneObj(response["data"]);

        this.profiles = this.getAllProfiles();
      },
      (error) => {
        this.showErrorModal = this.errorHandler.errorHandleFunction(error);
        this.applicationsLoading = false;
      }
    );
  }

  getAllProfiles(): object[] {
    let profiles = []
    for(let job of this.jobs) 
      for(let employee of job.employees) 
        profiles[employee.details.id] = employee.details;
    return profiles;
  }

  previewEmployeeProfile(emplId, jobIndex, emplIndex) {
    this.isChatPopupVisible = false;
    this.employeeProfile = this.profiles[emplId];

    this.selectedEmployee = {};
    this.selectedEmployee["job_id"] = this.jobs[jobIndex].id;
    this.selectedEmployee["job_index"] = jobIndex;
    this.selectedEmployee["job_title"] = this.jobs[jobIndex].job_title;
    this.selectedEmployee["employee_id"] = this.jobs[jobIndex]["employees"][emplIndex].id;
    this.selectedEmployee["employee_index"] = emplIndex;
    this.selectedEmployee["application_id"] = this.jobs[jobIndex]["employees"][emplIndex].application_id;
    this.selectedEmployee["account_type"] = this.jobs[jobIndex]["employees"][emplIndex].account_type;
    this.selectedEmployee["name"] = this.jobs[jobIndex]["employees"][emplIndex].name;
    this.selectedEmployee["picture"] = this.jobs[jobIndex]["employees"][emplIndex].picture;
    this.selectedEmployee["is_job_completed"] = this.jobs[jobIndex]["employees"][emplIndex].is_job_completed;

    $(".worker-profile").hide();
    $(".worker-profile").fadeIn(600);
    $(".company-details").hide();
    $(".company-details").fadeIn(600);

    $(".employee").removeClass("selected");
    $("#employee" + jobIndex + emplIndex).addClass("selected");
  }
  
  previewEmployeeProfileOnPopup(emplId, jobIndex, emplIndex) {
    this.employeeProfile = this.profiles[emplId];

    this.selectedEmployee = {};
    this.selectedEmployee["job_id"] = this.jobs[jobIndex].id;
    this.selectedEmployee["job_index"] = jobIndex;
    this.selectedEmployee["job_title"] = this.jobs[jobIndex].job_title;
    this.selectedEmployee["employee_id"] = this.jobs[jobIndex]["employees"][emplIndex].id;
    this.selectedEmployee["employee_index"] = emplIndex;
    this.selectedEmployee["application_id"] = this.jobs[jobIndex]["employees"][emplIndex].application_id;
    this.selectedEmployee["account_type"] = this.jobs[jobIndex]["employees"][emplIndex].account_type;
    this.selectedEmployee["name"] = this.jobs[jobIndex]["employees"][emplIndex].name;
    this.selectedEmployee["picture"] = this.jobs[jobIndex]["employees"][emplIndex].picture;
    this.selectedEmployee["is_job_completed"] = this.jobs[jobIndex]["employees"][emplIndex].is_job_completed;

    $("#previewProfileModal").modal("show");
  }

  previewEmployeeProfileForRatring(emplId, jobIndex, emplIndex) {
    this.employeeProfile = this.profiles[emplId];

    this.selectedEmployee = {};
    this.selectedEmployee["job_id"] = this.jobs[jobIndex].id;
    this.selectedEmployee["job_index"] = jobIndex;
    this.selectedEmployee["job_title"] = this.jobs[jobIndex].job_title;
    this.selectedEmployee["employee_id"] = this.jobs[jobIndex]["employees"][emplIndex].id;
    this.selectedEmployee["employee_index"] = emplIndex;
    this.selectedEmployee["application_id"] = this.jobs[jobIndex]["employees"][emplIndex].application_id;
    this.selectedEmployee["account_type"] = this.jobs[jobIndex]["employees"][emplIndex].account_type;
    this.selectedEmployee["name"] = this.jobs[jobIndex]["employees"][emplIndex].name;
    this.selectedEmployee["picture"] = this.jobs[jobIndex]["employees"][emplIndex].picture;
    this.selectedEmployee["is_job_completed"] = this.jobs[jobIndex]["employees"][emplIndex].is_job_completed;

    $("#previewProfileRateModal").modal("show");
  }


  confirmDiscontinue() {
    this.circleSpinDiscontinue = true;

    //google analytics
    this.googleAnalyticsService.emitEvent("hire/hired", "discontinue-applicant", null, null);

    let tokenParsed = this.authService.getToken();
    let options = {headers: new HttpHeaders({ Authorization: "Bearer " + tokenParsed })};
    let application_id = this.selectedEmployee["application_id"];
    this.hdService.discontinueApplicant({ application_id }, options).subscribe(
      (response) => {
        this.circleSpinDiscontinue = false;

        const selEmplJobIndex = this.selectedEmployee["job_index"];
        const selEmplIndex = this.selectedEmployee["employee_index"];
        this.jobs[selEmplJobIndex]["employees"].splice(selEmplIndex, 1);

        // hide modal
        setTimeout(function () {
          $(".modal").modal("hide"); // closes all active pop ups.
          $(".modal-backdrop").remove(); // removes the grey overlay.
        }, 100);

        //remove applicant
        this.toastr.success("Discontinued Successfully!", "", {closeButton: true});
      },
      (error) => {
        this.circleSpinDiscontinue = false;

        if (error.status == 400) {
          this.toastr.error("Sorry, something went wrong. Please try again.", "Error", {closeButton: true});
        }
        if (error.status == 401 && error.statusText == "Unauthorized") {
          this.authService.tokenExpired();
        }
      }
    );
  }

  confirmComplete() {
    this.circleSpinComplete = true;

    //google analytics
    this.googleAnalyticsService.emitEvent("hire/hired", "complete-job", null, null);

    let tokenParsed = this.authService.getToken();
    let options = {headers: new HttpHeaders({ Authorization: "Bearer " + tokenParsed })};
    let application_id = this.selectedEmployee["application_id"];
    this.hdService.completeJob({ application_id }, options).subscribe(
      (response) => {
        this.circleSpinComplete = false;

        const selEmplJobIndex = this.selectedEmployee["job_index"];
        const selEmplIndex = this.selectedEmployee["employee_index"];
        this.jobs[selEmplJobIndex]["employees"][selEmplIndex].is_job_completed = true;
        this.allJobs[selEmplJobIndex]["employees"][selEmplIndex].is_job_completed = true;

        // hide modal
        setTimeout(function () {
          $(".modal").modal("hide"); // closes all active pop ups.
          $(".modal-backdrop").remove(); // removes the grey overlay.
        }, 100);

        //remove applicant
        this.toastr.success("Completed Successfully!", "", {
          closeButton: true,
        });
      },
      (error) => {
        this.circleSpinComplete = false;

        if (error.status == 400) {
          this.toastr.error("Sorry, something went wrong. Please try again.", "Error",{closeButton: true});
        }
        if (error.status == 401 && error.statusText == "Unauthorized") {
          this.authService.tokenExpired();
        }
      }
    );
  }

  onRateChange = (rating: { score: number }, experienceIndex) => {
    //google analytics
    this.googleAnalyticsService.emitEvent("hire/hired", "rated", null, null);

    let tokenParsed = this.authService.getToken();
    let options = {headers: new HttpHeaders({ Authorization: "Bearer " + tokenParsed })};
    let value = {
      application_id: this.selectedEmployee["application_id"],
      rating_point: rating.score,
    };
    this.hdService.rateJob(value, options).subscribe(
      (response) => {
        const selEmplJobIndex = this.selectedEmployee["job_index"];
        const selEmplIndex = this.selectedEmployee["employee_index"];
        const empLId =  this.selectedEmployee["employee_id"];
        this.jobs[selEmplJobIndex]["employees"][selEmplIndex].has_rating_request = false;
        this.jobs[selEmplJobIndex]["employees"][selEmplIndex].rating = rating.score;
        this.profiles[empLId].experiences[experienceIndex].rating_status = this.RATING_STATUSES.rated;
        this.profiles[empLId].experiences[experienceIndex].rating = rating.score;
        this.profiles[empLId].rating = this.updateProfileRating(this.profiles[empLId].experiences);

        // updat all jobs
        this.allJobs[selEmplJobIndex]["employees"][selEmplIndex].has_rating_request = false;
        this.allJobs[selEmplJobIndex]["employees"][selEmplIndex].rating = rating.score;

        // hide modal
        setTimeout(function () {
          $(".modal").modal("hide"); // closes all active pop ups.
          $(".modal-backdrop").remove(); // removes the grey overlay.
        }, 100);

        this.toastr.success("Rated Successfully!", "", {closeButton: true});
      },
      (error) => {
        if (error.status == 400) {
          this.toastr.error("Sorry, something went wrong. Please try again.","Error", {closeButton: true});
        }
        if (error.status == 401 && error.statusText == "Unauthorized") {
          this.authService.tokenExpired();
        }
      }
    );
  };

  updateProfileRating(experiences) {
    let totalPoint = 0;
    let totalRatedExperience = 0;
    for (let experience of experiences) {
      if (experience.rating_status === this.RATING_STATUSES.rated) {
        totalPoint += experience.rating ? experience.rating : 0;
        totalRatedExperience++;
      }
    }
    return totalRatedExperience > 0
      ? (totalPoint / totalRatedExperience).toFixed(1)
      : 0;
  }

  moveApplicantToTopInJob(jobIndex, applicantIndex) {
  }

  hasRatingRequest(experience) {
    return this.selectedEmployee["application_id"] == experience.application_id 
      && experience.rating_status == this.RATING_STATUSES.pending
      ? true
      : false;
  }

  search() {
    this.jobs = JSON.parse(JSON.stringify(this.allJobs));
    this.noDataFound = false;

    let query = $("#search").val();
    for (let job of this.jobs) {
      for (let employee of job.employees) {
        if (
          !employee.name.toLowerCase().includes(query) &&
          !job.job_title.toLowerCase().includes(query)
        ) {
          const index = job.employees.indexOf(employee);
          job.employees.splice(index);
        }
      }

      // delete job
      if (job.employees.length == 0) {
        const index = this.jobs.indexOf(job);
        this.jobs.slice(index);
      }
    }

    if (this.jobs.length == 0) {
      this.noDataFound = true;
    }
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
      this.jobs = JSON.parse(JSON.stringify(this.allJobs));

      for (let job of this.jobs) {
        for (let employee of job.employees) {
          if (
            !employee.name.toLowerCase().includes(query) &&
            !job.job_title.toLowerCase().includes(query)
          ) {
            const index = job.employees.indexOf(employee);
            job.employees.splice(index);
          }
        }
        // delete job
        if (job.employees.length == 0) {
          const key = this.jobs.indexOf(job);
          this.jobs.splice(key);
        }
      }

      if (this.jobs.length == 0) {
        this.noDataFound = true;
      }
    }, 300);
  }

  getLogoCoverSectionClass() {
    return "logo-cover-section-with-phn";
  }

  // ----------- chat ------------
  // also in work applied
  getMsgSenderInfo(phone) {
    return {
      application_id: this.selectedEmployee.application_id,
      id: this.selectedEmployee.employee_id,
      name: this.selectedEmployee.name,
      profile_pic: this.selectedEmployee.picture,
      job_title: this.selectedEmployee.job_title,
      application_status: this.selectedEmployee.is_job_completed 
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
