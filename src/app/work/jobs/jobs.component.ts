import { ErrorHandlerService } from "./../../services/error-handler.service";
import { Component, OnInit } from "@angular/core";
import { JobService } from "../../services/job.service";
import { AuthService } from "../../services/auth.service";
import { HttpHeaders } from "@angular/common/http";
import * as $ from "jquery";
declare var $: any;
import { HostListener } from "@angular/core";
import { TypeaheadMatch } from "ngx-bootstrap/typeahead/typeahead-match.class";
import { NgProgress } from "@ngx-progressbar/core";
import { ToastrService } from "ngx-toastr";
import {
  trigger,
  style,
  transition,
  animate,
  keyframes,
  query,
  stagger,
  group,
} from "@angular/animations";
import { GoogleAnalyticsService } from "../../services/google-analytics.service";
import { responsiveService } from "../../services/responsive.service";
import { FavouriteService } from "../../services/favourite.service";
import { isString } from "util";
import { environment } from "../../../environments/environment";
declare var ga: any; // <-- Here we declare GA variable
import {
  SwiperComponent,
  SwiperDirective,
  SwiperConfigInterface,
  SwiperScrollbarInterface,
  SwiperPaginationInterface,
} from "ngx-swiper-wrapper";
import { CommonService } from "../../services/common.service";
import { Subject, Notification } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { select } from "@angular-redux/store";
import { NotificationService } from "../../notification/notification.service";

@Component({
  selector: "app-jobs",
  templateUrl: "./jobs.component.html",
  styleUrls: ["./jobs.component.css"],
  animations: [
    trigger("listAnimation", [
      transition(":leave", [
        group([
          animate("150ms ease-in-out", style({ opacity: "0", height: 0 })),
        ]),
      ]),
    ]),
  ],
})
export class JobsComponent implements OnInit {
  @select() threadsUnseenMsgs;
  searchTermChanged: Subject<string> = new Subject<string>();

  private INDV_NAME = environment.individualName;
  private COMP_NAME = environment.companyName;
  private WORK_APPLIED_SECTION = environment.sectionNames.WORK_APPLIED_SECTION;
  private WORK_HIRED_SECTION = environment.sectionNames.WORK_HIRED_SECTION;

  public isMobile: Boolean; //responsive checker
  public user: any;
  searchFieldSelected: string;
  previewProfLoading = false;
  private paginationLoading: boolean = false;


  jobs = [];
  allJobs = [];
  filters = [];
  selectedFilterOptions = {};
  savedFilterOptions = [];
  public selectedJob = null;
  public profile = null;
  public profiles = [];
  public next_page_url: any;
  public pagination = [];
  public jobsLoading = false;
  public showErrorModal = false;
  public filterCountCall = true;
  public request: any;
  private isActiveFavouriteBtn;
  private isActiveFilterBtn;
  circleSpin = false;
  jobsSeen = [];

  chatNotifications = [];
  statusOfApplications = [];
  hasWorkAppliedSectionNotif = false;
  hasWorkHiredSectionNotif = false;

  defaultProfImg: any = "../assets/images/default_profile.png";
  defaultCoverPhoto: any = "../assets/images/default_cover.png";
  defaultCompImg: any = "../assets/images/default_company.png";
  defaultEducationImg: any = "../assets/images/default-education.png";
  defaultAwardImg: any = "../assets/images/default_award.png";

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
    private jobService: JobService,
    private authService: AuthService,
    private toastr: ToastrService,
    private favouriteService: FavouriteService,
    private cmnService: CommonService,
    private notifService: NotificationService
  ) {}

  ngOnInit() {
    this.progress.start();
    this.getJobsData();

    //responsive checker
    this.onResize();
    this.responsiveService.checkWidth();

    this.isActiveFavouriteBtn = false;
    this.isActiveFilterBtn = false;
  }

  //responsive checker
  onResize() {
    this.responsiveService.getMobileStatus().subscribe((isMobile) => {
      this.isMobile = isMobile;
    });

    $(".modal").modal("hide");
  }

  getJobsData() {
    let value: any;
    this.jobsLoading = true;

    let token_parsed = this.authService.getToken();
    let options = {
      headers: new HttpHeaders({ Authorization: "Bearer " + token_parsed }),
    };

    this.jobService.getJobs(value, options).subscribe(
      (response) => {
        this.progress.done();
        this.jobsLoading = false;

        this.pagination = response["pagination"];
        this.next_page_url = response["pagination"].next_page_url;
        this.jobs = response["data"];
        this.allJobs = [...this.jobs];

        if (this.jobs.length == 0) {
          // this.noDataFound = true;
        } else {
          setTimeout(() => {
            this.showJob(0);

            $('.job').removeClass("selected");
            $('#job' + 0).addClass("selected");
          }, 0);
        }

        this.filters = response["filters"];

        this.jobService.getJobsSeen().subscribe((resp) => {
          this.jobsSeen = resp !== null ? resp['jobs'] : [];
        });
      },
      (error) => {
        this.jobsLoading = false;
        this.showErrorModal = this.errorHandler.errorHandleFunction(error);
      }
    );
  }

  onScrollDown() {
    // remove previous data call
    if (this.request) {
      if (this.request.closed == false) {
        this.request.unsubscribe();
      }
    }

    // new data call
    if (this.pagination["current_page"] != this.pagination["last_page"]) { // check in future: i think this.pagination is not necesary. jobs.pagination can do the job
      this.paginationLoading = true;
      let token_parsed = this.authService.getToken();
      let options = {
        headers: new HttpHeaders({ Authorization: "Bearer " + token_parsed }),
      };

      this.request = this.jobService.getPaginateJobsData(this.next_page_url, options).subscribe(
        (response) => {
          // new pagination data can be updated in jobs then updating this.pagination & this.next_page_url
          this.pagination = response["pagination"];
          this.next_page_url = response["pagination"].next_page_url;
          this.jobs = this.jobs.concat(response["data"]);
          this.paginationLoading = false;
        },
        (error) => {
          if (error.status == 0 || error.status == 500 || error.status == 404) {
            setTimeout(() => {
              this.onScrollDown();
            }, 5000);
          }

          if (error.status == 401 && error.statusText == "Unauthorized") {
            this.authService.tokenExpired();
          }
        }
      );
    }
  }

  showJob(index) {
    this.selectedJob = this.jobs[index];

    $(".job-details").hide();
    $(".job-details").fadeIn(600);

    $('.job').removeClass("selected");
    $('#job' + index).addClass("selected");

    return false;
  }

  showJobOnPopup(index) {
    this.selectedJob = null;
    this.selectedJob = this.jobs[index];

    $(".jobInfo").removeClass("selected");
    $("#showJob" + index).addClass("selected");

    if(!this.jobsSeen[this.selectedJob.id]){
      this.jobService.markAsSeen(this.selectedJob.id);
    }

    return false;
  }

  onChangeSearch(value: string) {
    if (this.searchTermChanged.observers.length === 0) {
      this.searchTermChanged
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe((term) => {
          this.isActiveFilterBtn = false;
          this.isActiveFavouriteBtn = false;
          this.jobs = [...this.allJobs];

          this.updateSearch({ search_job: term });
        });
    }
    this.searchTermChanged.next(value);
  }

  showFilter() {
    this.updateCheckboxesStatus();

    if (!this.isActiveFilterBtn) {
      this.cmnService.filterResetAll();
      this.jobs = [...this.allJobs];

      this.searchFieldSelected = null;
      this.isActiveFavouriteBtn = false;
    }
  }

  applyFilter() {
    let checkboxes = $("input:checkbox");
    this.isActiveFilterBtn = true;

    this.selectedFilterOptions = this.getSelectedFilterOptions(checkboxes);
    this.updateSearch(this.selectedFilterOptions);
  }

  removeFilter() {
    this.jobsLoading = true;

    // showing loaedr for 500ms
    setTimeout(() => {
      this.jobsLoading = false;

      this.cmnService.filterResetAll();
      this.jobs = [...this.allJobs];

      this.isActiveFilterBtn = false;
      this.isActiveFavouriteBtn = false;
      this.savedFilterOptions = [];
    }, 300);
  }

  getSelectedFilterOptions(checkboxes) {
    let options = [];
    let choices = {};
    checkboxes.each(function () {
      if (this.checked) {
        let post_value = this.value;

        if ($(this).attr("class") === "salary_ranges") {
          let salary_data = {};
          salary_data["start"] = $(this).data("start");
          salary_data["end"] = $(this).data("end");
          post_value = salary_data;
        }

        if (!choices.hasOwnProperty($(this).attr("class")))
          choices[$(this).attr("class")] = [post_value];
        else choices[$(this).attr("class")].push(post_value);

        options[this.id] = true;
      } else {
        options[this.id] = false;
      }
    });
    this.savedFilterOptions = options;
    return choices;
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

  getAppliedFilterOptions() {
    let checkboxes = $("input:checkbox");
    const options = this.getSelectedFilterOptions(checkboxes);

    return options;
  }

  updateSearch(filters) {
    this.jobsLoading = true;

    if (filters["search_job"] != null) {
      this.isActiveFavouriteBtn = false;
      this.isActiveFilterBtn = false;
      this.jobs = [...this.allJobs];
    } else {
      delete filters.search_job;
    }
    let filter = { filters };

    let token_parsed = this.authService.getToken();
    let options = {
      headers: new HttpHeaders({ Authorization: "Bearer " + token_parsed }),
    };
    this.jobService.getJobs(filter, options).subscribe(
      (response) => {
        this.jobs = response["data"];
        this.next_page_url = response["pagination"].next_page_url;
        this.jobsLoading = false;
      },
      (error) => {
        if (error.status == 401 && error.statusText == "Unauthorized") {
          this.authService.tokenExpired();
        }
      }
    );
  }

  applyJob(job) {
    this.circleSpin = true;

    this.googleAnalyticsService.emitEvent("job", "apply", null, null);

    let token_parsed = this.authService.getToken();
    let options = {
      headers: new HttpHeaders({ Authorization: "Bearer " + token_parsed }),
    };
    let id = job.id;
    
    this.jobService.postApplyJob({ id }, options).subscribe(
      (response) => {
        this.notifService.saveNotification(response['success']['data']);
        this.circleSpin = false;

        //instantly remove job
        job.apply_status = false;
        let index = this.jobs.indexOf(job);
        this.jobs.splice(index, 1);
        this.allJobs = this.jobs;

        if(this.jobs.length > 0){
          let selectedIndex = (index >= this.jobs.length) ? index-1 : index;
          this.selectedJob = this.jobs[selectedIndex];

          // set background color to selected job
          let selectedId = (index >= this.jobs.length) ? index-1 : index+1;
          $('.job').removeClass("selected");
          $('#job' + selectedId).addClass("selected");
        }

        // hide  modal
        setTimeout(function () {
          $(".modal").modal("hide"); // closes all active pop ups.
          $(".modal-backdrop").remove(); // removes the grey overlay.
        }, 100);

        this.toastr.success("Applied Successfully!", "", {
          closeButton: true,
        });
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

  getFavourites() {
    this.jobsLoading = true;

    this.searchFieldSelected = null;
    this.isActiveFilterBtn = false;
    this.isActiveFavouriteBtn = !this.isActiveFavouriteBtn;
    this.jobs = [...this.allJobs];

    // showing loaedr for 500ms
    setTimeout(() => {
      this.jobsLoading = false;
    }, 500);

    if (this.isActiveFavouriteBtn) {
      let favouritedJobs = this.jobs.filter(
        (job) => job.is_favourited === true
      );
      this.jobs = [...favouritedJobs];
    }
  }

  favouriteJob(id) {
    let index = this.jobs
      .map(function (x) {
        return x.id;
      })
      .indexOf(id);
    this.jobs[index].is_favourited = true;

    let token_parsed = this.authService.getToken();
    let options = {
      headers: new HttpHeaders({ Authorization: "Bearer " + token_parsed }),
    };
    this.favouriteService.favouriteJob({ id }, options).subscribe(
      (response) => {},
      (error) => {
        this.jobs[index].is_favourited = false;

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

  unfavouriteJob(id) {
    let index = this.jobs
      .map(function (x) {
        return x.id;
      })
      .indexOf(id);
    this.jobs[index].is_favourited = false;

    let token_parsed = this.authService.getToken();
    let options = {
      headers: new HttpHeaders({ Authorization: "Bearer " + token_parsed }),
    };
    this.favouriteService.unfavouriteJob({ id }, options).subscribe(
      (response) => {},
      (error) => {
        this.jobs[index].is_favourited = true;

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

  // note: data should be cached as worker may see save compnay detals for multiple jobs
  // note: same function in work-applied section
  showProfile(employerId) {
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
    const query = "?excepts=phone";
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

  getLogoCoverSectionClass() {
    return "logo-cover-section";
  }
}