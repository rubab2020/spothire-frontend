import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { FormGroup } from "@angular/forms";
import * as $ from "jquery";
declare var $: any;
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { select } from "@angular-redux/store";
import { HireDashboardService } from "./hire-dashboard.service";
import { AuthService } from "../services/auth.service";
import { JwtHelperService } from "@auth0/angular-jwt";
import { JobService } from "./job.service";
import { FavouriteService } from "./favourite.service";
import { WriteOfferService } from "./write-offer.service";
import { ToastrService } from "ngx-toastr";

@Injectable()
export class CommonService {
  @select() threadsUnseenMsgs;

  private INDV_NAME = environment.individualName;
  private COMP_NAME = environment.companyName;
  private APPLICATION_STATUSES = environment.applicationStatuses;
  private API_URL = environment.apiUrl;

  private statusOfWorkAndHireApplicationsUrl = `${this.API_URL}/api/profile/work-and-hire/get-status-of-applications`;

  public user: any;
  public token: any;
  public showErrorModal = false;

  constructor(
    private http: HttpClient,
    private hdservice: HireDashboardService,
    private authService: AuthService,
    private jobService: JobService,
    private favouriteService: FavouriteService,
    private writeOfferService: WriteOfferService,
    private toastr: ToastrService,
  ) {}

  cloneObj(objects) {
    return JSON.parse(JSON.stringify(objects));
  }

  formatTo12Hours(time) {
    if (time) {
      let [hours, minutes] = time.split(":");
      let modifier = +hours < 12 ? "AM" : "PM";
      hours = +hours % 12 || 12;
      minutes = minutes === 0 ? "" : `:${minutes}`;
      return hours + minutes + modifier;
    }
    return null;
  }

  dateFormat(date) {
    if (date == null) return;

    if (!date.getMonth) date = new Date(date + "T00:00:00Z");

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    var monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return monthNames[monthIndex] + " " + day + ", " + year;
  }

  getEducationName(profile) {
    if (profile.qualifications.length > 0) {
      return profile.qualifications[0].degree;
    } else {
      return null;
    }
  }

  getInstituteName(profile) {
    if (profile.qualifications.length > 0) {
      return profile.qualifications[0].institution;
    } else {
      return null;
    }
  }

  countSiteEmployers(experiences) {
    return experiences.filter((experience) => experience.application_id != null)
      .length;
  }

  getApplicationDeadline(numOfDays) {
    let currentDate = new Date();
    let advertDuration = this.addDays(new Date(), numOfDays);
    return this.dateFormat(advertDuration);
  }

  addDays(theDate, days) {
    return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
  }

  formatWorkdays(days) {
    let formatedDays = [];
    for (let day of days) {
      if (day.hasOwnProperty("name")) {
        formatedDays.push(day.name.substring(0, 3));
      } else {
        formatedDays.push(day.substring(0, 3));
      }
    }
    return formatedDays;
  }

  truncateText(text, length) {
    if (text) {
      return text.length > 200 ? text.substring(0, length) + "..." : text;
    }
    return "";
  }

  removePublicActionsFromStorage() {
    localStorage.removeItem("pubSaveJob");
    localStorage.removeItem("pubApplyJobId");
    localStorage.removeItem("pubFavJobId");
  }

  //--------------- custom validations ------------
  dateLessThan(from: string, to: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let fromDate = group.controls[from];
      let toDate = group.controls[to];
      if (toDate.value && fromDate.value > toDate.value) {
        return {
          dates: "Start date should not exeed end date",
        };
      }
      return {};
    };
  }

  // timeLessThan(
  //   fromTime: string,
  //   toTime: string,
  //   fromDate: string,
  //   toDate: string
  // ) {
  //   return (group: FormGroup): { [key: string]: any } => {
  //     const fd = group.controls[fromDate];
  //     const td = group.controls[toDate];
  //     const ft = group.controls[fromTime];
  //     const tt = group.controls[toTime];

  //     if (td.value && fd.value > td.value) return {};

  //     if (fd.value && ft.value && tt.value) {
  //       const fromIime1Date = this.setDateTime(fd.value, ft.value);
  //       const toTime2Date = td.value
  //         ? this.setDateTime(td.value, tt.value)
  //         : this.setDateTime(fd.value, tt.value);
  //       if (fromIime1Date > toTime2Date) {
  //         return {
  //           times: "Start time should not exeed end time for same date",
  //         };
  //       }
  //       return {};
  //     }
  //     return {};
  //   };
  // }
  // -------------------------------------------------

  setDateTime(date, time) {
    const index = time.indexOf(":");

    const hours = time.substring(0, index);
    const minutes = time.substring(index + 1);

    const updatedDate = new Date(date.valueOf());

    updatedDate.setHours(hours);
    updatedDate.setMinutes(minutes);
    // updatedDate.setSeconds("00");

    return updatedDate;
  }

  minTwoDigits(n) {
    return (n < 10 ? "0" : "") + n;
  }

  customDateFormat(date) {
    return (
      date.getFullYear() +
      "-" +
      this.minTwoDigits(date.getMonth() + 1) +
      "-" +
      this.minTwoDigits(date.getDate())
    );
  }

  filterResetAll() {
    $("input:checkbox").prop("checked", false);
  }


  // human readable date & time show
  fulldays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  formatDateHumanRead(someDateTimeStamp){
    var dt = new Date(someDateTimeStamp),
    date = dt.getDate(),
    month = this.months[dt.getMonth()],
    timeDiff = someDateTimeStamp - Date.now(),
    diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)),
    diffYears = new Date().getFullYear() - dt.getFullYear();

    if(diffYears === 0 && diffDays === 0){
      // return "Today";
      return this.formatAMPM(dt); 
    }else if(diffYears === 0 && diffDays === -1) {
      return "Yesterday";
    }else if(diffYears === 0 && (diffDays < -1 && diffDays > -7)) {
      return this.fulldays[dt.getDay()];
    }else if(diffYears >= 1){
      return month + " " + date + ", " + new Date(someDateTimeStamp).getFullYear();
    }else {
      return month + " " + date;
    }
  }
  formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  encode(data) {
    if(typeof data === 'object' && data !== null){
      return btoa(JSON.stringify(data));
    }
    return btoa(data);
  }
  
  decode(data) {
    return atob(data);
  }

  // sends curl request
  sendNotification(data) {
    const key = "AAAAeodNdlw:APA91bEPSam30zGL52Y8FeIXK1ydJL_10-LodJA-Tr452rx9-HYcFnvWhk6xGe8CSsmxd_zd1rctHdN8BbmhYJTz4CXdyVrgfg82XvADEt4fxjh77i3ofsK2WEfiCGGtqG6pHWI6tMbK";
    const url = 'https://fcm.googleapis.com/fcm/send';
    const headers = new HttpHeaders()
      .set('Authorization', `key=${key}`)
      .set('Content-Type','application/json');
    
    const body = {
      notification: data.notification,
      registration_ids: data.tokens,
      data: data.data
    };

    return this.http
      .post(url, body, {headers})
      .subscribe(res => {
        // console.log(res)
    });
  }

  // getStatusOfWorkHireApplications(value, options){
  //   return this.http.post(this.statusOfWorkAndHireApplicationsUrl, value, options);    
  // }

  // hasSectionNotification(sectionName, notifApplicationIds, statusOfAllApplications) {
  //   const jwtHelper = new JwtHelperService();
  //   this.token = this.authService.getToken();
  //   this.user = jwtHelper.decodeToken(this.token);
  //   this.user.id = this.authService.getId();

  //   switch (sectionName) {
  //     case environment.sectionNames.HIRE_APPLIED_SECTION :
  //       for(let applicationId in notifApplicationIds) {
  //         if(
  //           statusOfAllApplications[applicationId] 
  //           && statusOfAllApplications[applicationId].applicant_id !== this.user.id 
  //           && (
  //             statusOfAllApplications[applicationId].application_status === this.APPLICATION_STATUSES.applied
  //             || statusOfAllApplications[applicationId].application_status === this.APPLICATION_STATUSES.interviewed
  //           )
  //         ){
  //          return true;
  //         }
  //       }
  //       return false;
  //     case environment.sectionNames.HIRE_HIRED_SECTION :
  //       for(let applicationId in notifApplicationIds) {
  //         if(
  //           statusOfAllApplications[applicationId] 
  //           && statusOfAllApplications[applicationId].applicant_id !== this.user.id
  //           && (
  //             statusOfAllApplications[applicationId].application_status === this.APPLICATION_STATUSES.assigned
  //             || statusOfAllApplications[applicationId].application_status === this.APPLICATION_STATUSES.completed
  //           )
  //         ){
  //          return true; 
  //         }
  //       }
  //       return false;
  //     case environment.sectionNames.WORK_APPLIED_SECTION :
  //       for(let applicationId in notifApplicationIds) {
  //         if(
  //           statusOfAllApplications[applicationId] 
  //           && statusOfAllApplications[applicationId].applicant_id === this.user.id 
  //           && (
  //             statusOfAllApplications[applicationId].application_status === this.APPLICATION_STATUSES.applied
  //             || statusOfAllApplications[applicationId].application_status === this.APPLICATION_STATUSES.interviewed
  //           )
  //         ){
  //           return true;
  //         }
  //       }
  //       return false;
  //     case environment.sectionNames.WORK_HIRED_SECTION :
  //         for(let applicationId in notifApplicationIds) {
  //           if(
  //             statusOfAllApplications[applicationId]
  //             && statusOfAllApplications[applicationId].applicant_id === this.user.id
  //             && (
  //               statusOfAllApplications[applicationId].application_status === this.APPLICATION_STATUSES.assigned
  //               || statusOfAllApplications[applicationId].application_status === this.APPLICATION_STATUSES.completed
  //             )
  //           ){
  //            return true; 
  //           }
  //         }
  //         return false;
  //     default :
  //       return false;
  //   }
  // }

  chatDeleted(thread) {
    return thread.deletedByMembers
      && thread.deletedByMembers[this.user.id]
      ? true 
      : false;
  }

  savePublicPagesActivites() {
    let pubSaveJob = localStorage.getItem("pubSaveJob");
    let pubApplyJobId = localStorage.getItem("pubApplyJobId");
    let pubFavJobId = localStorage.getItem("pubFavJobId");
    if (pubSaveJob) {
      pubSaveJob = JSON.parse(pubSaveJob);
      this.savePublicJob(pubSaveJob);
      localStorage.removeItem("pubSaveJob");
    } else if (pubApplyJobId) {
      this.savePublicApplyJob(pubApplyJobId);
      localStorage.removeItem("pubApplyJobId");
    } else if (pubFavJobId) {
      this.savePublicFavouriteJob(pubFavJobId);
      localStorage.removeItem("pubFavJobId");
    }
  }

  savePublicJob(job) {
    let token_parsed = this.authService.getToken();
    let options = {
      headers: new HttpHeaders({ Authorization: "Bearer " + token_parsed }),
    };

    this.writeOfferService.postJobData(job, options).subscribe(
      (response) => {
        this.toastr.success('Thanks for your job post. The ad will remain for 30 days once it has been approved.', "Success", {
          closeButton: true,
        });
        // this.router.navigate(["hire/applied"]);
      },
      (error) => {
        if (error.status == 400) {
          this.toastr.error(error.error.error.message, "Error", {
            closeButton: true,
          });
          // this.afterSocialLoginRedirect(data, decodedtoken);
        } else if (error.statusText == "Unathorized") {
          this.authService.tokenExpired();
        }
      }
    );
  }

  savePublicApplyJob(id) {
    let token_parsed = this.authService.getToken();
    let options = {
      headers: new HttpHeaders({ Authorization: "Bearer " + token_parsed }),
    };

    this.jobService.postApplyJob({ id }, options).subscribe(
      (response) => {
        this.toastr.success('Applied successfully.', "Success", {
          closeButton: true,
        });
        // this.router.navigate(["work/applied"]);
      },
      (error) => {
        if (error.status == 400) {
          this.toastr.error(error.error.error.message, "Error", {
            closeButton: true,
          });
          // this.afterSocialLoginRedirect(data, decodedtoken);
        } else if (error.status == 401 && error.statusText == "Unauthorized") {
          this.authService.tokenExpired();
        }
      }
    );
  }

  savePublicFavouriteJob(id) {
    let token_parsed = this.authService.getToken();
    let options = {
      headers: new HttpHeaders({ Authorization: "Bearer " + token_parsed }),
    };
    this.favouriteService.favouriteJob({ id }, options).subscribe(
      (response) => {
        this.toastr.success('Favourited successfully.', "Success", {
          closeButton: true,
        });
        // this.router.navigate(["work/jobs"]);
      },
      (error) => {
        if (error.status == 400) {
          this.toastr.error(error.error.error.message, "Error", {
            closeButton: true,
          });
          // this.afterSocialLoginRedirect(data, decodedToken);
        }
        if (error.status == 401 && error.statusText == "Unauthorized") {
          this.authService.tokenExpired();
        }
      }
    );
  }
}