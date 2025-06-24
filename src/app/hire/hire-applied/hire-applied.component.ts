import { ErrorHandlerService } from "./../../services/error-handler.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { HttpHeaders } from "@angular/common/http";
import { HireDashboardService } from "../../services/hire-dashboard.service";
import * as $ from "jquery";
declare var $: any;
import { element } from "protractor";
import { HostListener } from "@angular/core";
import { NgProgress } from "@ngx-progressbar/core";
import { TypeaheadMatch } from "ngx-bootstrap/typeahead/typeahead-match.class";
import {trigger,state,style,animate,transition,group} from "@angular/animations";
import { GoogleAnalyticsService } from "../../services/google-analytics.service";
import { responsiveService } from "../../services/responsive.service";
import { environment } from "../../../environments/environment";
import { ToastrService } from "ngx-toastr";
import { JwtHelperService } from "@auth0/angular-jwt";
import { isString } from "util";
import { getLocaleDateTimeFormat } from "@angular/common";
import { CommonService } from "../../services/common.service";
import { ThreadService } from "../../chat/thread.service";
import { select } from '@angular-redux/store';
import { last, map, mergeMap, take } from 'rxjs/operators';
import { Observable } from "rxjs";
import isEqual from 'lodash/isEqual';
import { NotificationService } from "../../notification/notification.service";
import { AngularFirestore } from "angularfire2/firestore";
import { forkJoin } from "rxjs/observable/forkJoin";

@Component({
  selector: "app-hire-applied",
  templateUrl: "./hire-applied.component.html",
  styleUrls: ["./hire-applied.component.css"],
})
export class HireAppliedComponent implements OnInit {
  public INDV_NAME = environment.individualName;
  public COMP_NAME = environment.companyName;
  public APPLICATION_STATUSES = environment.applicationStatuses;
  public REIVEW_STATUSES = environment.reviewStatuses;
  public HIRE_APPLIED_SECTION = environment.sectionNames.HIRE_APPLIED_SECTION;
  public HIRE_HIRED_SECTION = environment.sectionNames.HIRE_HIRED_SECTION;

  hasHireAppliedSectionNotif = false;
  hasHireHiredSectionNotif = false;

  public filtersData: any;
  selectedFilterOptions = {};
  savedFilterOptions = [];

  public jobs: any;
  public allJobs: any;
  public selectedJob: any;

  Object = Object;
  private paginationLoading: boolean = false;
  private isActiveFilterBtn;

  public request: any;
  public isMobile: Boolean; //responsive checker

  public isFiltersLoaded = false;

  public showInterviewBtn = false;
  public showDeclineBtn = false;
  public showAssignBtn = false;

  public selectedApplicant: any;

  public showErrorModal = false;
  public noDataFound = false;
  public timeout;

  public showLoaderProfile = false;
  public profileApiCall = true;
  public profiles: object[];
  public workerProfile = null; 

  public showMsgBtn = false;
  isChatPopupVisible = false;

  public user: any;
  public token: any;
  public profilePicture: string;
  public coverPhoto: string;

  circleSpinDelete = false;
  circleSpinHire = false;
  circleSpinInterview = false;
  circleSpinDecline = false;
  public applicationsLoading = false;

  jobsCollapseStatus = [];

  defaultProfImg: any = "../assets/images/default_profile.png";
  defaultCoverPhoto: any = "../assets/images/default_cover.png";
  defaultCompImg: any = "../assets/images/default_company.png";
  messageDot: any = "../assets/images/dot.png";
  defaultEducationImg: any = "../assets/images/default-education.png";
  defaultAwardImg: any = "../assets/images/default_award.png";
  noPhone: string = "../assets/images/no-phone.png";

  chatNotifications = [];
  statusOfAllApplications = [];
  notifUniqueApplicationsIds = [];

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
 
    this.getHireAppliedData();

    //responsive checker
    this.onResize();
    this.responsiveService.checkWidth();

    $(".modal").modal("hide");
    
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
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

  moveApplicantToTopInJob(jobIndex, applicantIndex) {
    let fromIndex = applicantIndex;
    let toIndex = 0;
    let element = this.jobs[jobIndex]["applicants"]['data'][applicantIndex];
    this.jobs[jobIndex]["applicants"]['data'].splice(fromIndex, 1);
    this.jobs[jobIndex]["applicants"]['data'].splice(toIndex, 0, element);

    // update all jobs
    this.allJobs[jobIndex]["applicants"]['data'].splice(fromIndex, 1);
    this.allJobs[jobIndex]["applicants"]['data'].splice(toIndex, 0, element);
  }

  // ----------- chat ------------
  // also in work applied
  getMsgSenderInfo(phone) {
    return {
      application_id: this.selectedApplicant.application_id,
      id: this.selectedApplicant.applicant_id,
      name: this.selectedApplicant.name,
      profile_pic: this.selectedApplicant.picture,
      job_title: this.selectedApplicant.job_title,
      application_status: this.selectedApplicant.application_status,
      phone: phone
    }
  }
  // also in work applied
  chat(receiverId: string, applicationId: string) {
    this.isChatPopupVisible = true;
    
    return this.threadService.getThread(applicationId).subscribe((data) => {
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

  getHireAppliedData() {
    this.applicationsLoading = true;

    let tokenParsed = this.authService.getToken();
    let options = {headers: new HttpHeaders({ Authorization: "Bearer " + tokenParsed })};
    let value = [];
    this.hdService.getHireAppliedData(value, options).subscribe(
      (response) => {
        this.progress.done();

        this.isFiltersLoaded = true;
        this.applicationsLoading = false;

        if (response["data"].jobs.length == 0) {
          this.noDataFound = true;
        }
        
        this.jobs = response["data"].jobs;
        this.allJobs = this.cmnService.cloneObj(response["data"].jobs);
        this.filtersData = response["data"].filters;
        
        this.profiles = this.getAllProfiles();

        this.initJobsCollapseStatus();
    
        this.openFirstApplicantProfile(response["data"]['jobs']);
      },
      (error) => {
        this.showErrorModal = this.errorHandler.errorHandleFunction(error);
        this.applicationsLoading = false;
      }
    );
  }

  openFirstApplicantProfile(jobs) {
    if(!this.noDataFound) {
      setTimeout(() => {
        if(jobs[0].applicants.data.length > 0){
          this.previewApplicantProfile(
            jobs[0].applicants.data[0]['details']['id'], 
            jobs[0].applicants.data[0]['application_status'], 
            0, 
            0
          );
        }
      }, 0);
    }
  }

  getAllProfiles(): object[] {
    let profiles = []
    for(let job of this.jobs) 
      for(let applicant of job.applicants.data) 
        profiles[applicant.details.id] = applicant.details;
    return profiles;
  }


  previewApplicantProfile(applicantId, applicationStatus, jobIndex, applicantIndex) {
    this.isChatPopupVisible = false;
    this.workerProfile = this.profiles[applicantId];

    let interviewDate = this.jobs[jobIndex]["applicants"]['data'][applicantIndex].interview_date
      ? new Date(this.jobs[jobIndex]["applicants"]['data'][applicantIndex].interview_date)
      : null;

    this.selectedApplicant = {};
    this.selectedApplicant["job_id"] = this.jobs[jobIndex].id;
    this.selectedApplicant["job_index"] = jobIndex;
    this.selectedApplicant["job_title"] = this.jobs[jobIndex].job_title;
    this.selectedApplicant["is_payment_completed"] = this.jobs[jobIndex].is_payment_completed;
    this.selectedApplicant["is_temporary_unlocked"] = this.jobs[jobIndex].is_temporary_unlocked;
    this.selectedApplicant["temp_unlock_due_till"] = this.jobs[jobIndex].temp_unlock_due_till;
    this.selectedApplicant["due_amount"] = this.jobs[jobIndex].due_amount;
    this.selectedApplicant["applicant_id"] = this.jobs[jobIndex]["applicants"]['data'][applicantIndex].details.id;
    this.selectedApplicant["applicant_index"] = applicantIndex;
    this.selectedApplicant["application_id"] = this.jobs[jobIndex]["applicants"]['data'][applicantIndex].application_id;
    this.selectedApplicant["account_type"] = this.jobs[jobIndex]["applicants"]['data'][applicantIndex].account_type;
    this.selectedApplicant["name"] = this.jobs[jobIndex]["applicants"]['data'][applicantIndex].details.name;
    this.selectedApplicant["profile_picture"] = this.jobs[jobIndex]["applicants"]['data'][applicantIndex].details.profile_picture;
    this.selectedApplicant["application_status"] = applicationStatus;
    this.selectedApplicant["interview_date"] = interviewDate
      ? interviewDate.getDate() 
        + "/" 
        + (interviewDate.getMonth() + 1) 
        + "/" 
        + interviewDate.getFullYear()
      : null;
    this.selectedApplicant["interview_time"] = this.jobs[jobIndex]["applicants"]['data'][applicantIndex].interview_time;

    // acticate & inactivate action buttons
    this.showInterviewBtn = true;
    this.showAssignBtn = true;
    this.showDeclineBtn = true;
    this.showMsgBtn = true;

    $(".worker-profile").hide();
    $(".worker-profile").fadeIn(600);
    $(".company-details").hide();
    $(".company-details").fadeIn(600);

    $('.job-applicant').removeClass("selected");
    $('#jobApplicant' + jobIndex + applicantIndex).addClass("selected");
  }

  previewApplicantProfileOnPopup(applicantId, applicationStatus, jobIndex, applicantIndex) {
    this.workerProfile = this.profiles[applicantId];

    let interviewDate = this.jobs[jobIndex]["applicants"]['data'][applicantIndex].interview_date
      ? new Date(this.jobs[jobIndex]["applicants"]['data'][applicantIndex].interview_date)
      : null;

    this.selectedApplicant = {};
    this.selectedApplicant["job_id"] = this.jobs[jobIndex].id;
    this.selectedApplicant["job_index"] = jobIndex;
    this.selectedApplicant["job_title"] = this.jobs[jobIndex].job_title;
    this.selectedApplicant["is_payment_completed"] = this.jobs[jobIndex].is_payment_completed;
    this.selectedApplicant["is_temporary_unlocked"] = this.jobs[jobIndex].is_temporary_unlocked;
    this.selectedApplicant["temp_unlock_due_till"] = this.jobs[jobIndex].temp_unlock_due_till;
    this.selectedApplicant["due_amount"] = this.jobs[jobIndex].due_amount;
    this.selectedApplicant["applicant_id"] = this.jobs[jobIndex]["applicants"]['data'][applicantIndex].details.id;
    this.selectedApplicant["applicant_index"] = applicantIndex;
    this.selectedApplicant["application_id"] = this.jobs[jobIndex]["applicants"]['data'][applicantIndex].application_id;
    this.selectedApplicant["account_type"] = this.jobs[jobIndex]["applicants"]['data'][applicantIndex].account_type;
    this.selectedApplicant["name"] = this.jobs[jobIndex]["applicants"]['data'][applicantIndex].details.name;
    this.selectedApplicant["profile_picture"] = this.jobs[jobIndex]["applicants"]['data'][applicantIndex].details.profile_picture;
    this.selectedApplicant["application_status"] = applicationStatus;
    this.selectedApplicant["interview_date"] = interviewDate
      ? interviewDate.getDate() 
        + "/" 
        + (interviewDate.getMonth() + 1) 
        + "/" 
        + interviewDate.getFullYear()
      : null;
    this.selectedApplicant["interview_time"] = this.jobs[jobIndex]["applicants"]['data'][applicantIndex].interview_time;

    // acticate & inactivate action buttons
    this.showInterviewBtn = true;
    this.showAssignBtn = true;
    this.showDeclineBtn = true;
    
    if(applicationStatus == this.APPLICATION_STATUSES.interviewed) {
      this.showMsgBtn = true;
    }

    $("#previewProfileModal").modal("show");
  }

  previewJob(index) {
    this.selectedJob = this.jobs[index];
    $("#jobPreviewModal").modal("show");
  }

  deleteJob(job) {
    this.selectedJob = job;
    $("#jobDeleteModal").modal("show");
  }

  confirmJobDelete(id) {
    this.circleSpinDelete = true;

    let token_parsed = this.authService.getToken();
    let options = {headers: new HttpHeaders({ Authorization: "Bearer " + token_parsed })};
    this.hdService.deletejob({ id }, options).subscribe(
      (response) => {
        this.circleSpinDelete = false;

        // remove job
        let index = null;
        this.jobs.forEach((job, jobIndex) => {
          if (job.id == id) {
            index = jobIndex;
            return;
          }
        });
        if (index >= 0) {
          this.jobs.splice(index, 1);
        }

        // hide modal
        setTimeout(function () {
          $(".modal").modal("hide"); // closes all active pop ups.
          $(".modal-backdrop").remove(); // removes the grey overlay.
        }, 100);

        this.toastr.success("Deleted Job Successfully!", "", {closeButton: true});
      },
      (error) => {
        this.circleSpinDelete = false;

        if (error.status == 400) {
          this.toastr.error("Sorry, something went wrong. Please try again.", "Error", {closeButton: true});
        }
        if (error.status == 401 && error.statusText == "Unauthorized") {
          this.authService.tokenExpired();
        }
      }
    );
  }

  confirmDecline() {
    this.circleSpinDecline = true;

    //google analytics
    this.googleAnalyticsService.emitEvent("hire/applied", "withdraw-applicant", null, null);

    let tokenParsed = this.authService.getToken();
    let options = {headers: new HttpHeaders({ Authorization: "Bearer " + tokenParsed })};
    let application_id = this.selectedApplicant["application_id"];

    this.hdService.declineApplicant({ application_id }, options).subscribe((response) => {
      this.circleSpinDecline = false;

      //remove applicant
      this.jobs[this.selectedApplicant["job_index"]]["applicants"]['data']
        .splice(this.selectedApplicant["applicant_index"], 1);

      this.showInterviewBtn = false;
      this.showDeclineBtn = false;
      this.showAssignBtn = false;

      // hide modal
      setTimeout(function () {
        $(".modal").modal("hide"); // closes all active pop ups.
        $(".modal-backdrop").remove(); // removes the grey overlay.
      }, 100);

      this.toastr.success("Declined Successfully!", "", {closeButton: true});
    },
    (error) => {
      this.circleSpinDecline = false;

      if (error.status == 400) {
        this.toastr.error("Sorry, something went wrong. Please try again.", "Error", {closeButton: true});
      }
      if (error.status == 401 && error.statusText == "Unauthorized") {
        this.authService.tokenExpired();
      }
    });
  }

  confirmInterview() {
    this.circleSpinInterview = true;

    let interview_date = $("#interviewDate").val();
    if (interview_date) {
      let date = new Date(interview_date);
      interview_date = date.getFullYear() 
        + "-" 
        + this.minTwoDigits(date.getMonth() + 1) 
        + "-" 
        + this.minTwoDigits(date.getDate());
    }
    let interview_time = $("#interviewTime").val();

    //google analytics
    this.googleAnalyticsService.emitEvent("hire/applied", "interview-applicant", null, null);

    let tokenParsed = this.authService.getToken();
    let options = {headers: new HttpHeaders({ Authorization: "Bearer " + tokenParsed }),};
    let application_id = this.selectedApplicant["application_id"];

    this.hdService.interviewApplicant({ application_id, interview_date, interview_time }, options).subscribe(
      (response) => {
        this.notifService.saveNotification(response['success']['data']);
        this.circleSpinInterview = false;

        //update applicant's application status & quick invitation
        let jobIndx = this.selectedApplicant["job_index"];
        let applicantIndex = this.selectedApplicant["applicant_index"];
        this.jobs[jobIndx]["applicants"]['data'][applicantIndex].application_status = this.APPLICATION_STATUSES.interviewed;
        this.jobs[jobIndx]["applicants"]['data'][applicantIndex].interview_date = interview_date;
        this.jobs[jobIndx]["applicants"]['data'][applicantIndex].interview_time = interview_time;

        // update in alljobs
        this.allJobs[jobIndx]["applicants"]['data'][applicantIndex].application_status = this.APPLICATION_STATUSES.interviewed;
        this.allJobs[jobIndx]["applicants"]['data'][applicantIndex].interview_date = interview_date;
        this.allJobs[jobIndx]["applicants"]['data'][applicantIndex].interview_time = interview_time;

        // hide modal
        setTimeout(function () {
          $(".modal").modal("hide"); // closes all active pop ups.
          $(".modal-backdrop").remove(); // removes the grey overlay.
        }, 100);

        this.toastr.success("Interview Call done  Successfully!", "", {closeButton: true});
      },
      (error) => {
        this.circleSpinInterview = false;

        if (error.status == 400) {
          this.toastr.error("Sorry, something went wrong. Please try again.", "Error", {closeButton: true});
        }
        if (error.status == 401 && error.statusText == "Unauthorized") {
          this.authService.tokenExpired();
        }
      }
    );
  }

  // also in writ offer and pblic write offer
  minTwoDigits(n) {
    return (n < 10 ? "0" : "") + n;
  }

  confirmHiringApplicant() {
    this.circleSpinHire = true;

    //google analytics
    this.googleAnalyticsService.emitEvent("hire/applied", "hire-applicant", null, null);

    let tokenParsed = this.authService.getToken();
    let options = {headers: new HttpHeaders({ Authorization: "Bearer " + tokenParsed })};
    let application_id = this.selectedApplicant["application_id"];

    this.hdService.assignApplicant({ application_id }, options).subscribe(
      (response) => {
        this.notifService.saveNotification(response['success']['data']);
        this.circleSpinHire = false;

        //remove applicant
        const jobIndex = this.selectedApplicant["job_index"];
        this.jobs[jobIndex]["applicants"]['data'].splice(this.selectedApplicant["applicant_index"], 1);

        this.showInterviewBtn = false;
        this.showDeclineBtn = false;
        this.showAssignBtn = false;

        // hide modal
        setTimeout(function () {
          $(".modal").modal("hide"); // closes all active pop ups.
          $(".modal-backdrop").remove(); // removes the grey overlay.
        }, 100);

        this.toastr.success("Hired Successfully!", "", {closeButton: true});
      },
      (error) => {
        this.circleSpinHire = false;

        if (error.status == 400) {
          this.toastr.error(error.message,"Error", {closeButton: true});
        }
        if (error.status == 401 && error.statusText == "Unauthorized") {
          this.authService.tokenExpired();
        }
      }
    );
  }

  toggleFavourite(application_id, jobIndex, applicantIndex) {
    this.jobs[jobIndex]["applicants"]['data'][applicantIndex]
      .is_short_listed = !this.jobs[jobIndex]["applicants"]['data'][applicantIndex].is_short_listed;

    let tokenParsed = this.authService.getToken();
    let options = {headers: new HttpHeaders({ Authorization: "Bearer " + tokenParsed })};
    this.hdService.shortlistApplication({ application_id }, options).subscribe(
      (response) => {
        this.allJobs[jobIndex]["applicants"]['data'][applicantIndex]
          .is_short_listed = !this.allJobs[jobIndex]["applicants"]['data'][applicantIndex].is_short_listed;

        this.showInterviewBtn = false;
        this.showDeclineBtn = false;
        this.showAssignBtn = false;
      },
      (error) => {
        this.jobs = this.cmnService.cloneObj(this.allJobs);

        if (error.status == 400) {
          this.toastr.error("Sorry, something went wrong. Please try again.", "Error", {closeButton: true});
        }
        if (error.status == 401 && error.statusText == "Unauthorized") {
          this.authService.tokenExpired();
        }
      }
    );
  }

  showFilter() {
    this.updateCheckboxesStatus();

    if (!this.isActiveFilterBtn) {
      this.cmnService.filterResetAll();
      this.jobs = [...this.allJobs];
    }
  }

  updateCheckboxesStatus() {
    for (let key in this.savedFilterOptions) {
      if (this.savedFilterOptions[key]) {
        $("#" + key).prop("checked", true);
      } else {
        $("#" + key).prop("checked", false);
      }
    }
  }

  applyFilter() {
    let $checkboxes = $("input:checkbox");
    this.isActiveFilterBtn = true;

    this.selectedFilterOptions = this.getSelectedFilterOptions($checkboxes);
    this.updateSearch(this.selectedFilterOptions);
  }

  removeFilter() {
    this.applicationsLoading = true;
    this.noDataFound = false;

    // showing loaedr for 500ms
    setTimeout(() => {
      this.applicationsLoading = false;
      this.noDataFound = false;

      this.cmnService.filterResetAll();
      this.jobs = [...this.allJobs];
      this.savedFilterOptions = [];
    }, 300);
  }

  getSelectedFilterOptions($checkboxes) {
    let options = [];
    let choices = {};
    $checkboxes.each(function () {
      if (this.checked) {
        let post_value = this.value;
        if (!choices.hasOwnProperty($(this).attr("class")))
          choices[$(this).attr("class")] = [post_value];
        else 
          choices[$(this).attr("class")].push(post_value);
        options[this.id] = true;
      } else {
        options[this.id] = false;
      }
    });
    this.savedFilterOptions = options;
    return choices;
  }

  updateSearch(filters) {
    this.applicationsLoading = true;

    // showing loaedr for 500ms
    setTimeout(() => {
      this.jobs = this.cmnService.cloneObj(this.allJobs);
      for (let filterName in filters) {
        let options = filters[filterName];
        if (options.length == 0) {
          continue;
        }

        if (filterName == "job_titles") {
          this.jobs = this.filterOnJobTitles(this.jobs, options);
        }
        if (filterName == "application_statuses") {
          this.jobs = this.filterOnApplicationStatuses(this.jobs, options);
        }

        //------------------
        // filter on profile
        //------------------

        if (filterName == "skills") {
          this.jobs = this.filterOnSkills(this.jobs, options);
        }
        if (filterName == "qualifications") {
          this.jobs = this.filterOnQualifications(this.jobs, options);
        }
        if (filterName == "universities") {
          this.jobs = this.filterOnUniversities(this.jobs, options);
        }
      }

      this.applicationsLoading = false;
      if (this.jobs.length === 0) {
        this.noDataFound = true;
      } else {
        this.noDataFound = false;
      }
    }, 300);
  }

  filterOnJobTitles(jobs, options) {
    for (let jobKey = jobs.length - 1; jobKey >= 0; jobKey--) {
      if (!options.includes(jobs[jobKey]["job_title"])) {
        jobs.splice(jobKey, 1);
      }
    }
    return jobs;
  }

  filterOnApplicationStatuses(jobs, filterOptions) {
    let options = this.cmnService.cloneObj(filterOptions);

    //remove shortlisted from options as it not listed in filter options
    let hasShortListedFilter = options.includes("shortlisted");
    if (hasShortListedFilter) {
      for (let key in options) {
        if (options[key] == "shortlisted") {
          options.splice(key, 1);
        }
      }
    }

    // remove appicants
    for (let jobKey = jobs.length - 1; jobKey >= 0; jobKey--) {
      let applicants = jobs[jobKey]["applicants"]['data'];

      for (let applicantKey = applicants.length - 1; applicantKey >= 0; applicantKey--) {
        let applicant = applicants[applicantKey];
        if (hasShortListedFilter && applicant["is_short_listed"]) 
          continue;
        if (hasShortListedFilter && !applicant["is_short_listed"] && options.length == 0) {
          applicants.splice(applicantKey, 1);
          continue;
        }
        let hasUnmatchedStatus = !options.includes(applicant["application_status"]) && options.length > 0;
        if (hasUnmatchedStatus) 
          applicants.splice(applicantKey, 1);
      }

      // remove job index if applicants are an empty list
      if (applicants.length == 0) {
        jobs.splice(jobKey, 1);
      }
    }
    return jobs;
  }

  filterOnSkills(jobs, options) {
    for (let jobKey = jobs.length - 1; jobKey >= 0; jobKey--) {
      let applicants = jobs[jobKey]["applicants"]['data'];

      for (let applicantKey = applicants.length - 1; applicantKey >= 0; applicantKey--) {
        let applicant = applicants[applicantKey];
        let profile = this.profiles[applicant.id];

        // on skills
        let hasSkill = this.isSkillsInOptions(profile["skills"], options);

        // remove applicant
        if (!hasSkill) {
          applicants.splice(applicantKey, 1);
        }
      }

      // remove job index if applicants are an empty list
      if (applicants.length == 0) {
        jobs.splice(jobKey, 1);
      }
    }
    return jobs;
  }

  filterOnQualifications(jobs, options) {
    for (let jobKey = jobs.length - 1; jobKey >= 0; jobKey--) {
      let applicants = jobs[jobKey]["applicants"]['data'];

      for (let applicantKey = applicants.length - 1; applicantKey >= 0; applicantKey--) {
        let applicant = applicants[applicantKey];
        let profile = this.profiles[applicant.id];
        let hasQualification = this.isQualificationsInOptions(profile["qualifications"], options);
        if (!hasQualification) {
          applicants.splice(applicantKey, 1);
        }
      }

      // remove job index if applicants are an empty list
      if (applicants.length == 0) {
        jobs.splice(jobKey, 1);
      }
    }
    return jobs;
  }

  filterOnUniversities(jobs, options) {
    for (let jobKey = jobs.length - 1; jobKey >= 0; jobKey--) {
      let applicants = jobs[jobKey]["applicants"]['data'];

      for (let applicantKey = applicants.length - 1; applicantKey >= 0; applicantKey--) {
        let applicant = applicants[applicantKey];
        let profile = this.profiles[applicant.id];
        let hasUniversity = this.isUniversitiesInOptions(profile["qualifications"], options);
        if (!hasUniversity) {
          applicants.splice(applicantKey, 1);
        }
      }

      // remove job index if applicants are an empty list
      if (applicants.length == 0) {
        jobs.splice(jobKey, 1);
      }
    }
    return jobs;
  }

  isQualificationsInOptions(qualifications, options) {
    for (let key in qualifications) {
      if (options.includes(qualifications[key]["degree"])) {
        return true;
      }
    }
    return false;
  }

  isUniversitiesInOptions(qualifications, options) {
    for (let key in qualifications) {
      if (options.includes(qualifications[key]["institution"])) {
        return true;
      }
    }
    return false;
  }

  isSkillsInOptions(skills, options) {
    for (let key in skills) {
      if (options.includes(skills[key]["name"])) {
        return true;
      }
    }
    return false;
  }

  isJobPaymentCompleted() {
    if (this.selectedApplicant == undefined) return false;

    return this.selectedApplicant["is_payment_completed"] || this.selectedApplicant["is_temporary_unlocked"]
      ? true : false;
  }

  isPendingPaymentExpired() {
    if (this.selectedApplicant == undefined) return false;

    if (this.selectedApplicant["temp_unlock_due_till"] != null) {
      let currrentDate = new Date();
      let dueDate = new Date(this.selectedApplicant["temp_unlock_due_till"]);
      if (dueDate > currrentDate) return true;
    }
    return false;
  }

  showDuePaymentModal() {
    this.selectedApplicant["due_amount"];
  }

  confirmPayment(payment_type) {
    let job_id = this.selectedApplicant["job_id"];
    let jobIndex = this.selectedApplicant["job_index"];
    let applicantIndex = this.selectedApplicant["applicant_index"];

    if (payment_type === "hand") {
      this.jobs[jobIndex].is_payment_completed = true;
      this.jobs[jobIndex].is_temporary_unlocked = true;
      this.jobs[jobIndex].temp_unlock_due_till = this.setPaymentDueDate();
      this.jobs[jobIndex].due_amount = null;
      this.selectedApplicant["is_temporary_unlocked"] = true;
      this.toastr.success("Your job is now unlocked!", "", {closeButton: true});

      let tokenParsed = this.authService.getToken();
      let options = {headers: new HttpHeaders({ Authorization: "Bearer " + tokenParsed })};
      this.hdService.makePayment({ job_id, payment_type }, options).subscribe(
        (response) => {
        },
        (error) => {
          this.jobs = this.cmnService.cloneObj(this.allJobs);
          this.selectedApplicant["is_temporary_unlocked"] = false;

          if (error.status == 400) {
            this.toastr.error("Sorry, something went wrong. Please try again.", "Error", {closeButton: true});
          }
          if (error.status == 401 && error.statusText == "Unauthorized") {
            this.authService.tokenExpired();
          }
        }
      );
    }
  }

  setPaymentDueDate() {
    let date = new Date();
    let numberOfDaysToAdd = 2;
    let dueDate = date.setDate(date.getDate() + numberOfDaysToAdd);
    return dueDate;
  }

  resetDateInput() {
    $("#interviewDate").val("");
  }

  getLogoCoverSectionClass() {
    return this.isJobPaymentCompleted() ? "logo-cover-section-with-phn" : "logo-cover-section";
  }

  getCardHeaderClass(job) {
    if (job.review_status == this.REIVEW_STATUSES.approved)
      return "approved";
    else 
      return "not-approved";
  }
  getCardHeaderTitleClass(job) {
    if (job.review_status == this.REIVEW_STATUSES.approved)
      return "job-title-approved";
    else 
      return "job-title-not-approved";
  }
  getCardCollapseIconClass(job) {
    if (job.review_status == this.REIVEW_STATUSES.approved)
      return "job-collapse-icon-approved";
    else 
      return "job-collapse-icon-not-approved";
  }

  initJobsCollapseStatus() {
    this.jobsCollapseStatus[0] = false;
    for (let i = 1; i < this.jobs.length; i++) {
      this.jobsCollapseStatus[i] = true;
    }
  }

  isCollapsedJob(index) {
    this.jobsCollapseStatus[index] = !this.jobsCollapseStatus[index];
    for (let i = 0; i < this.jobs.length; i++)
      if (i != index)
        this.jobsCollapseStatus[i] = true;
    return this.jobsCollapseStatus[index];
  }

  hasJobNotification(jobId) {
    for(let applicationId in this.statusOfAllApplications){
      if(this.statusOfAllApplications[applicationId].job_id == jobId)
        return true;
    }
    return false;
  }

  onScrollDown(pagination, jobIndex) {
    // remove previous data call
    if (this.request) {
      if (this.request.closed == false) {
        this.request.unsubscribe();
      }
    }

    // new data call
    if (pagination["current_page"] != pagination["last_page"]) {
      this.paginationLoading = true;
      let token_parsed = this.authService.getToken();
      let options = {
        headers: new HttpHeaders({ Authorization: "Bearer " + token_parsed }),
      };

      this.request = this.hdService.getPaginatedApplicants(pagination['next_page_url'], options, this.jobs[jobIndex]['id']).subscribe(
        (response) => {
          this.jobs[jobIndex]['applicants']['data'] = this.jobs[jobIndex]['applicants']['data'].concat(response["data"]);
          this.jobs[jobIndex]['applicants']['pagination'] = response["pagination"];
          this.paginationLoading = false;
        },
        (error) => {
          if (error.status == 0 || error.status == 500 || error.status == 404) {
            setTimeout(() => {
              this.onScrollDown(pagination, jobIndex);
            }, 5000);
          }

          if (error.status == 401 && error.statusText == "Unauthorized") {
            this.authService.tokenExpired();
          }
        }
      );
    }
  }
}