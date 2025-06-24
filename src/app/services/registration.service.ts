import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable()
export class RegistrationService {
  private API_URL = environment.apiUrl;
  private url = `${this.API_URL}/api/register`;
  // private login_url = `${this.API_URL}/api/login`;
  private feedback_url = `${this.API_URL}/api/feedback/store`;
  private verifyUrl = `${this.API_URL}/api/verify`;
  private resendOTPUrl = `${this.API_URL}/api/otp/resend`;
  private basicDetailsUrl = `${this.API_URL}/api/save/basic-details`;

  constructor(private http: HttpClient) {}

  createUser(body) {
    return this.http.post(this.url, body);
  }

  createCompanyUser(body) {
    return this.http.post(this.url, body);
  }

  verifyUser(body) {
    return this.http.post(this.verifyUrl, body);
    // return this.http.get(this.verifyUrl + "/" + verification_token);
  }

  resendOTP(body) {
    return this.http.post(this.resendOTPUrl, body);
  }

  postBasicDetails(body, options) {
    return this.http.post(this.basicDetailsUrl, body, options);
  }

  // loginUser(value) {
  //   return this.http.post(this.login_url,value);
  // }

  postFeedback(value) {
    return this.http.post(this.feedback_url, value);
  }
}
