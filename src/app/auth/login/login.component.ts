import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../../services/auth.service";
import { GoogleAnalyticsService } from "../../services/google-analytics.service";
import { responsiveService } from "../../services/responsive.service";
import { environment } from "../../../environments/environment";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CommonService } from "../../services/common.service";
import * as $ from "jquery";
declare var $: any;

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  public isMobile: Boolean; //responsive checker
  private INDV_NAME = environment.individualName;
  private COMP_NAME = environment.companyName;
  public circleSpin = false;
  private API_URL = environment.apiUrl;
  togglePasswordIcon = false;
  public loginForm: FormGroup;

  constructor(
    private responsiveService: responsiveService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private _fb: FormBuilder, 
    private cmnService: CommonService
  ) {}

  ngOnInit() {
    this.loginForm = this._fb.group({
      phone: [
        "",
        [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
          Validators.pattern(/^[0-9 ]*$/),
        ]
      ],
      password: [
        "",
        [
          Validators.required,
        ]
      ]
    });
  }

  showPassword(input: any): any {
    input.type = input.type === 'password' ?  'text' : 'password';
    this.togglePasswordIcon = !this.togglePasswordIcon;
  }

  showRegister() {
    $("#registerModal").modal("show");
  }

  loginUser(value: any) {
    this.googleAnalyticsService.emitEvent("login", "login", null, null);

    this.loginForm.controls["phone"].markAsTouched();
    this.loginForm.controls["password"].markAsTouched();

    if (this.loginForm.valid) {
      this.circleSpin = true;
      let body = JSON.stringify(value);
      
      this.authService.login(body).subscribe(
        (response) => {
          if (response["data"]) {
            let jwtHelper = new JwtHelperService();
            let decodedToken = jwtHelper.decodeToken(response["data"].token);
  
            localStorage.setItem("id", response["data"]["user"].id);
            localStorage.setItem("name", response["data"]["user"].name);
            localStorage.setItem("email", response["data"]["user"].email);
            localStorage.setItem("profile_image", response["data"]["user"].profile_picture);
            localStorage.setItem("cover_image", response["data"]["user"].cover_photo);
            localStorage.setItem("token", response["data"].token);
  
            this.cmnService.savePublicPagesActivites();

            this.redirect(response, decodedToken);
          }
        },
        (error) => {
          this.circleSpin = false;
          let message = "Something went wrong! Please try again";
  
          if (
            error &&
            error.error &&
            error.error.error &&
            error.error.error.message
          )
            message = error.error.error.message;
          else if (error && error.name === "HttpErrorResponse")
            message = "Something went wrong. Please try again";
  
          this.toastr.error(message, "Error", {
            closeButton: true,
          });
        }
      );
    }
  }

  redirect(response, decodedToken) {
    if (response["data"]["user"].show_complete_now) {
      if (decodedToken.user_type == this.INDV_NAME) {
        this.router.navigate(["individual/about-yourself"]);
      } else {
        this.router.navigate(["company/introduction"]);
      }
    } else {
      this.router.navigate(["hire-or-serve"]);
    }
  }
}
