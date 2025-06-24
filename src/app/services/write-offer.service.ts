import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { RequestOptions } from "@angular/http";
import { environment } from "../../environments/environment";
@Injectable()
export class WriteOfferService {
  constructor(private http: HttpClient) {}
  private API_URL = environment.apiUrl;
  private getJobWriteOptionsUrl = `${this.API_URL}/api/job/write/options`;
  private getJobWriteOptionsPublicUrl = `${this.API_URL}/api/public/job/write/options`;
  private post_save_job_url = `${this.API_URL}/api/job/save`;
  private get_edit_job_url = `${this.API_URL}/api/job/edit/`;
  private post_delete_job_url = `${this.API_URL}/api/job/delete`;

  getJobOptions(options) {
    return this.http.get(this.getJobWriteOptionsUrl, options);
  }
  getJobOptionsPublic(options) {
    return this.http.get(this.getJobWriteOptionsPublicUrl, options);
  }

  postJobData(value, options) {
    return this.http.post(this.post_save_job_url, value, options);
  }

  getEditJobData(job_id, options) {
    return this.http.get(this.get_edit_job_url + job_id, options);
  }
}
