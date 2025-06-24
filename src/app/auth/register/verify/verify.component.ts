import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { RegistrationService } from '../../../services/registration.service';
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from '../../../../environments/environment';
import { HttpHeaders } from "@angular/common/http";
import * as $ from "jquery";
import { CommonService } from '../../../services/common.service';
declare var $: any;

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {
  public verifyForm: FormGroup;
  public circleSpin = false;
  public INDV_NAME = environment.individualName;
  public COMP_NAME = environment.companyName;
  private phone: string;

  timeLeft: number = 300; // seconds
  interval;
    
  constructor(
    private _fb: FormBuilder, 
    private toastr: ToastrService,
    private regService: RegistrationService,
    private router: Router,
    private route: ActivatedRoute,
    private cmnService: CommonService
  ) { }

  ngOnInit() {
    $(".modal").modal("hide");

    this.route.paramMap.subscribe((params) => {
      this.phone = params.get("phone");
    })
    
    this.verifyForm = this._fb.group({
      code: [
        "",
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
          Validators.pattern(/^[0-9 ]*$/),
        ]
      ],
      phone: this.phone
    });

    this.startTimer();
  }

  ngOnDestroy(){
    clearTimeout(this.interval);
  }

  verifyOtp(value: any) {
    this.verifyForm.controls["code"].markAsTouched();

    if (this.verifyForm.valid) {
      this.circleSpin = true;
      let body = JSON.stringify(value);

      this.regService.verifyUser(body).subscribe(
        (response) => {
          this.circleSpin = false;

          if(response["data"]) {
            this.verifyForm.reset();
            this.circleSpin = false;

            this.redirectToAfterLoginPage(response["data"]);
          }
        },
        (error) => {
          this.circleSpin = false;
          this.toastr.error(error.error.error.message, "Error", {
            closeButton: true,
            timeOut: 0,
          });
        }
      );
    }
  }

  redirectToAfterLoginPage(data) {
    let jwtHelper = new JwtHelperService();
    let decodedtoken = jwtHelper.decodeToken(data.token);
    localStorage.setItem("id", data["user"].id);
    localStorage.setItem("name", decodedtoken.name);
    localStorage.setItem("profile_image", data["user"].profile_picture);
    localStorage.setItem("token", data.token);

    this.cmnService.savePublicPagesActivites();

    this.router.navigate(["profile/basic-details"]);
  }

  resendOTP()
  {
    let phone = this.verifyForm.value['phone'];
    let body = {phone};
    this.regService.resendOTP(body).subscribe(
      (response) => {
        clearTimeout(this.interval);
        this.timeLeft = 300;
        this.startTimer();

        this.toastr.success(response["success"]["message"], "Success", {
          closeButton: true,
          timeOut: 0,
        });

      },
      (error) => {
        this.toastr.error(error.error.error.message, "Error", {
          closeButton: true,
          timeOut: 0,
        });
      }
    );
  }

  startTimer() {
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      }
    },1000)
  }

  secondsToMinutes(time){
    return Math.floor(time / 60)+':'+('0'+Math.floor(time % 60)).slice(-2); 
  }
}
