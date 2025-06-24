import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient,HttpHeaders } from '@angular/common/http';

@Injectable()
export class FavouriteService {
  private API_URL = environment.apiUrl;
  private favouriteUrl = `${this.API_URL}/api/favourite/job/add`;
  private unfavouriteUrl = `${this.API_URL}/api/favourite/job/remove`;
  // private favouritedJobsUrl = `${this.API_URL}/api/jobs?show_type=favourite`;

  constructor(private http:HttpClient) { }

  favouriteJob(value, options) {
    return this.http.post(this.favouriteUrl, value, options);
  }

  unfavouriteJob(value, options) {
    return this.http.post(this.unfavouriteUrl, value, options);
  }

  // getJobsData(value, options) {
  //   return this.http.post(this.favouritedJobsUrl,value,options);
  // }
}