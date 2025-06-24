import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
import { ToastrService } from "ngx-toastr";
@Injectable()
export class AuthService {
  private API_URL = environment.apiUrl;
  private login_url = `${this.API_URL}/api/login`;
  private logout_url = `${this.API_URL}/api/logout`;
  private verify_url = `${this.API_URL}/api/verify`;
  private password_reset_url = `${this.API_URL}/api/password-reset`;
  private password_forget_url = `${this.API_URL}/api/forgetPassword`;
  private refreshTokenUrl = `${this.API_URL}/api/refresh-token`;

  private forgetPasswordUpdateUrl = `${this.API_URL}/api/forgetPasswordUpdate`;
  // private updateEmailPhonePrivacyUrl = `${this.API_URL}/api/user/update/email_phone_privacy`;
  private deviceTokensUrl = `${this.API_URL}/api/notification/device-tokens`;
  private receiverDeviceTokensUrl = `${this.API_URL}/api/notification/device-tokens`;
  private saveDeviceTokenUrl = `${this.API_URL}/api/notification/device-tokens/save`;
  private isRefreshTokenCalled = false;
  private accessToken:string = null;
  constructor(
    private http: HttpClient, 
    private router: Router,
    private toastr: ToastrService
  ) {}

  getId() {
    let id = localStorage.getItem("id");

    if (!id) {
      return null;
    }
    if (id == "null") {
      return null;
    }
    return id;
  }

  getCoverPhoto() {
    let image_name = localStorage.getItem("cover_image");

    if (!image_name) {
      return null;
    }
    if (image_name == "null") {
      return null;
    }
    return image_name;
  }

  getImage() {
    let image_name = localStorage.getItem("profile_image");

    if (!image_name) {
      return null;
    }
    if (image_name == "null") {
      return null;
    }
    return image_name;
  }

  login(body) {
    return this.http.post(this.login_url, body);
  }

  logOut() {
    const token = localStorage.getItem("token");
    if (!token) {
      return false;
    }
    const options = {
      headers: new HttpHeaders({ Authorization: "Bearer " + token }),
    };
    let value: any;
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("profile_image");
    localStorage.removeItem("cover_image");
    localStorage.removeItem("show_complete_now");
    this.router.navigate([""]);
    return this.http
      .post(this.logout_url, value, options)
      .subscribe((response) => {
        if (response["success"] == true) {
        }
      });
  }

  isLoggedIn() {
    let jwtHelper = new JwtHelperService();
    let token = localStorage.getItem("token");
    if (!token) {
      return false;
    }
    let expirationDate = jwtHelper.getTokenExpirationDate(token);
    let isExpired = jwtHelper.isTokenExpired(token);
    return !isExpired;
  }
  
  get currentUser() {
    return {
      name: localStorage.getItem("name") ? localStorage.getItem("name") : null,
      email: localStorage.getItem("email")
        ? localStorage.getItem("email")
        : null,
      profile_picture: localStorage.getItem("profile_image")
        ? localStorage.getItem("profile_image")
        : null,
    };
  }

  tokenExpired() {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("profile_image");
    // localStorage.removeItem('user_type');
    this.router.navigate([""]);
  }

  tokenExpiredWithNavigation() {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("profile_image");
    // localStorage.removeItem('user_type');
  }

  getToken() {
    let token = localStorage.getItem("token");
    if (!token) {
      return false;
    }

    // the better service for refresh token is to get unauthorised(401) request first for any api call and then call for refresh token with refreshtoken value sent from localstorage
    let jwtHelper = new JwtHelperService();
    let isExpired = jwtHelper.isTokenExpired(token);
    if(!isExpired){
      let expirationDateTime: any = jwtHelper.getTokenExpirationDate(token);
      let today: any = new Date();
      let diffSecs = Math.abs(today - expirationDateTime); // seconds 
      let diffMins = Math.floor((diffSecs/1000)/60); // minutes
      let oneMinute = 1;
      let oneSecond = 1;

      // if(!this.isRefreshTokenCalled)
      // {
      //   this.isRefreshTokenCalled = true;
      //   console.log('true');
      // }
      // else {
      //   console.log('false');
      // }

      // if(diffMins <= oneMinute && !this.isRefreshTokenCalled) {
      if(diffMins <= oneSecond && !this.isRefreshTokenCalled) {
        this.isRefreshTokenCalled = true;
        this.refreshToken();
      }
      return token;
    }
    else{
      this.isRefreshTokenCalled = false;

      localStorage.removeItem("token");
      localStorage.removeItem("id");
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      localStorage.removeItem("profile_image");
      localStorage.removeItem("cover_image");
      localStorage.removeItem("show_complete_now");
      this.toastr.error("Loggedin Session Expied. Please Login again.", "Error", {
        closeButton: true,
      });
      this.router.navigate(["/"]);

      return false;
    }
  }

  refreshToken() {
    let options = {headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token") })};
    return this.postRefreshToken({}, options).subscribe(
      (response) => {
        if (response["data"]) {
          let jwtHelper = new JwtHelperService();
          let decodedToken = jwtHelper.decodeToken(response["data"].token);

          localStorage.setItem("id", response["data"]["user"].id);
          localStorage.setItem("name", response["data"]["user"].name);
          localStorage.setItem("email", response["data"]["user"].email);
          localStorage.setItem(
            "profile_image",
            response["data"]["user"].profile_picture
          );
          localStorage.setItem(
            "cover_image",
            response["data"]["user"].cover_photo
          );
          localStorage.setItem("token", response["data"].token);

          this.accessToken = response["data"].token;
        }

      },
      (error) => {
        this.accessToken = null;
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        localStorage.removeItem("profile_image");
        localStorage.removeItem("cover_image");
        localStorage.removeItem("show_complete_now");
        this.toastr.error("Loggedin Session Expied. Please Login again.", "Error", {
          closeButton: true,
        });
        this.router.navigate(["/"]);
      }
    );
  }

  postRefreshToken(value, options) {
    return this.http.post(this.refreshTokenUrl, value, options);
  }

  getUserType() {
    let jwtHelper = new JwtHelperService();
    let token = localStorage.getItem("token");
    let token_parsed = jwtHelper.decodeToken(token);
    if (!token) {
      return false;
    }
    return token_parsed.user_type;
  }

  hasCompleteNow() {
    let show_complete_now = localStorage.getItem("show_complete_now");
    return show_complete_now ? true : false;
  }

  getVerify(value) {
    return this.http.get(this.verify_url + "/" + value);
  }

  resetPassword(value, options) {
    return this.http.post(this.password_reset_url, value, options);
  }

  forgetPassword(value) {
    return this.http.post(this.password_forget_url, value);
  }

  forgetPasswordUpdate(value) {
    return this.http.post(this.forgetPasswordUpdateUrl, value);
  }

  // updateEmailPhonePrivacy(value, options) {
  //   return this.http.post(this.updateEmailPhonePrivacyUrl, value, options);
  // }

  // ---------------------------------
  // for push notification - firebase
  // ---------------------------------
  getDeviceTokens(options) {
    return this.http.get(this.deviceTokensUrl, options);
  }
  
  getReceiverDeviceTokens(value, options) {
    return this.http.get(this.receiverDeviceTokensUrl+'/'+value, options);
  }

  saveDeviceToken(value, options) {
    return this.http.post(this.saveDeviceTokenUrl, value, options);
  }
}
