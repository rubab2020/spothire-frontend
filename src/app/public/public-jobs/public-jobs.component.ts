import { ErrorHandlerService } from "./../../services/error-handler.service";
import { Component, OnInit } from "@angular/core";
import { JobService } from "../../services/job.service";
import { HttpHeaders } from "@angular/common/http";
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
import { isString } from "util";
import { environment } from "../../../environments/environment";
import { Router, ActivatedRoute } from "@angular/router";
import {
  SwiperComponent,
  SwiperDirective,
  SwiperConfigInterface,
  SwiperScrollbarInterface,
  SwiperPaginationInterface,
} from "ngx-swiper-wrapper";
import * as $ from "jquery";
import { CommonService } from "../../services/common.service";
declare var $: any;
declare var ga: any; // <-- Here we declare GA variable
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: "app-public-jobs",
  templateUrl: "./public-jobs.component.html",
  styleUrls: ["./public-jobs.component.css"],
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
export class PublicJobsComponent implements OnInit {
  searchTermChanged: Subject<string> = new Subject<string>();

  private INDV_NAME = environment.individualName;
  private COMP_NAME = environment.companyName;

  public isMobile: Boolean; //responsive checker
  public user: any;
  searchFieldSelected: string;
  previewProfLoading = false;

  jobs = [];
  allJobs = [];
  filters = [];
  selectedFilterOptions = {};
  savedFilterOptions = [];
  public showOverlay = false;
  public selectedJob = null;
  public profile = null;
  public profiles = [];
  public next_page_url: any;
  public pagination_active_data = [];
  public jobsLoading = false;
  public showErrorModal = false;
  public filterCountCall = true;
  public showSnipper = false;
  public request: any;
  private isActiveFilterBtn;
  circleSpin = false;

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
    private router: Router,
    private responsiveService: responsiveService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private errorHandler: ErrorHandlerService,
    public progress: NgProgress,
    private jobService: JobService,
    // private authService: AuthService,
    private toastr: ToastrService,
    private cmnService: CommonService
  ) {}

  ngOnInit() {
    this.getJobsData();
    this.progress.start();

    //responsive checker
    this.onResize();
    this.responsiveService.checkWidth();

    // this.isActiveFavouriteBtn = false;
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

    this.jobService.getPublicJobs(value).subscribe(
      (response) => {
        this.progress.done();
        this.jobsLoading = false;

        this.pagination_active_data = response["pagination"];
        this.next_page_url = response["pagination"].next_page_url;
        this.jobs = response["data"];
        this.allJobs = [...this.jobs];
        this.showSnipper = true;

        if (response["data"].length == 0) {
          this.showOverlay = true;
        } else {
          setTimeout(() => {
            this.showJob(0);
          }, 0);
        }

        this.filters = response["filters"];
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
    if (
      this.pagination_active_data["current_page"] !=
      this.pagination_active_data["last_page"]
    ) {
      this.request = this.jobService
        .getPublicPaginateJobsData(this.next_page_url)
        .subscribe(
          (response) => {
            this.pagination_active_data = response["pagination"];
            this.next_page_url = response["pagination"].next_page_url;
            this.jobs = this.jobs.concat(response["data"]);
          },
          (error) => {
            if (
              error.status == 0 ||
              error.status == 500 ||
              error.status == 404
            ) {
              setTimeout(() => {
                this.onScrollDown();
              }, 5000);
            }
          }
        );
    }
  }

  showJob(index) {
    this.selectedJob = this.jobs[index];

    $(".job").removeClass("selected");
    $("#job" + index).addClass("selected");

    $(".job-details").hide();
    $(".job-details").fadeIn(600);

    let top = document.getElementById("jobPreivew");
    if (top !== null) {
      top.scrollTop = 0;
      top = null;
    }
  }

  showJobOnPopup(index) {
    this.selectedJob = null;
    this.selectedJob = this.jobs[index];

    $(".jobInfo").removeClass("selected");
    $("#showJob" + index).addClass("selected");

    return false;
  }

  onChangeSearch(value: string) {
    if (this.searchTermChanged.observers.length === 0) {
      this.searchTermChanged
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe((term) => {
          this.isActiveFilterBtn = false;
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
    this.showOverlay = false;

    // showing loaedr for 500ms
    setTimeout(() => {
      this.jobsLoading = false;

      this.cmnService.filterResetAll();
      this.jobs = [...this.allJobs];

      this.isActiveFilterBtn = false;
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
    this.showOverlay = false;

    if (this.searchFieldSelected != null) {
      filters["search_job"] = this.searchFieldSelected;

      this.isActiveFilterBtn = false;
      this.jobs = [...this.allJobs];
    } else {
      delete filters.search_job;
    }
    let filter = { filters };

    this.jobService.getPublicJobs(filter).subscribe(
      (response) => {
        this.jobs = response["data"];
        this.next_page_url = response["pagination"].next_page_url;
        this.jobsLoading = false;
        this.showOverlay = this.jobs.length ? false : true;
      },
      (error) => {}
    );
  }

  applyJob(job) {
    this.cmnService.removePublicActionsFromStorage();
    this.googleAnalyticsService.emitEvent("public/job", "apply", null, null);
    localStorage.setItem("pubApplyJobId", job.id);
  }

  getFavourites() {
    $("#loginModal").modal("show");
  }

  favouriteJob(id) {
    this.cmnService.removePublicActionsFromStorage();
    localStorage.setItem("pubFavJobId", id);
    $("#loginModal").modal("show");
  }

  unfavouriteJob(id) {
    // this funciton will not be triggerd. keeping it just for the common job-card componet
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

    const query = "?excepts=phone";
    this.jobService.getPublicProfile(employerId, query).subscribe(
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
