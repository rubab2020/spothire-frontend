import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient,HttpHeaders } from '@angular/common/http';


@Injectable()
export class JobDetailsService {
  private API_URL     = environment.apiUrl;
  private jobDetailsUrl = `${this.API_URL}/api/job-details`;
  private publicJobDetailsUrl = `${this.API_URL}/api/public/job-details`;

  constructor(private http:HttpClient) { }

  getJobDetails(value, options) {
    return this.http.post(this.jobDetailsUrl, value, options);
  }

  getPublicJobDetails(value, options) {
    return this.http.post(this.publicJobDetailsUrl, value, options);
  }
}
