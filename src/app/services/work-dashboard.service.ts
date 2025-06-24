import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import {RequestOptions} from '@angular/http';
import { environment } from '../../environments/environment';

@Injectable()
export class WorkDashboardService {
  private API_URL = environment.apiUrl;

  private appliedUrl        = `${this.API_URL}/api/work/jobs/applied`;
  private assignedUrl       = `${this.API_URL}/api/work/jobs/assigned`;
  private jobWithdrawUrl    = `${this.API_URL}/api/work/job/withdraw`;
  private jobDiscontinueUrl = `${this.API_URL}/api/work/job/discontinue`;
  private ratingRequestUrl  = `${this.API_URL}/api/rating/request`;
  // private withdrawRatingRequestUrl = `${this.API_URL}/api/rating/withdraw`;

  constructor(private http:HttpClient) { }

  getAppliedJobs(value,options){
    return this.http.get(this.appliedUrl,options);
  }

  getAssignedJobs(value,options){
    return this.http.get(this.assignedUrl,options);
  }

  postWithdraw(value,options){
    return this.http.post(this.jobWithdrawUrl,value,options);
  }
  postDiscontinue(value,options){
    return this.http.post(this.jobDiscontinueUrl,value,options);
  }

  postRatingRequest(value,options){
    return this.http.post(this.ratingRequestUrl,value,options);
  }
  // withdrawForRating(value,options){
  //   return this.http.post(this.withdrawRatingRequestUrl,value,options);
  // }
}
