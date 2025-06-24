import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../../services/auth.service';
import { RegistrationService } from '../../services/registration.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { responsiveService } from '../../services/responsive.service';
import { environment } from '../../../environments/environment';
import * as $ from "jquery";
declare var $ : any;

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.css']
})

export class PasswordRecoveryComponent implements AfterViewInit {
  public isMobile: Boolean; //responsive checker
  public recoveryForm: FormGroup;
  public passwordForm: FormGroup;
  showCapcha = true;
  showPasswordReset = false;
  public token:any;
  public email:any;
  public circleSpin = false;

  errors = [];
  public showIndividual = true;
  public showCompany=false;

  public API_URL = environment.apiUrl;
  public INDV_NAME = environment.individualName;
  public COMP_NAME = environment.companyName;

  constructor(private _fb: FormBuilder,
    private route: ActivatedRoute,
    private responsiveService: responsiveService,
    private router: Router,
    private authService:AuthService ,
    private reg_service:RegistrationService,
    private toastr: ToastrService) { 
  }

  ngOnInit() {
    this.recoveryForm = this._fb.group({
      phone: [
        "",
        [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
          Validators.pattern(/^[0-9 ]*$/),
        ]
      ]
    });

    this.passwordForm = this._fb.group({
      phone: [
        "",
        [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
          Validators.pattern(/^[0-9 ]*$/),
        ]
      ],
      code: [
        "",
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
          Validators.pattern(/^[0-9 ]*$/),
        ]
      ],
      password:['', [Validators.required, Validators.minLength(8),Validators.pattern(/(?=\D*\d)(?=[^a-z]*[a-z])/)]],
      confirm_password:['', [Validators.required, Validators.minLength(8) ]]
    });

    $('.modal-backdrop').remove();
  }

  enablePasswordResetForm(phone) {
    this.showPasswordReset  = true;

    this.passwordForm.controls['phone'].setValue(phone);
  }

  ngAfterViewInit() {
  }

  sendOTP(value){
    this.circleSpin = true;

    this.recoveryForm.controls['phone'].markAsTouched()
    if(this.recoveryForm.valid){
      this.authService.forgetPassword(value).subscribe(response => {
        this.circleSpin = false;

        if (response['success']) {
          this.toastr.success(response['success']['message'], 'Success', {
            closeButton: true,
          });

          this.enablePasswordResetForm(response['data']['phone']); 
        }
      },error => {
        this.circleSpin = false;

        if(error.status == 401 && error.statusText == "Unauthorized"){
          this.authService.tokenExpiredWithNavigation();

          this.toastr.error(error.error.message, 'Error', {
            closeButton: true
          });
        }
        else{
          let data = error.error.error.message;
  
          Object.keys(data).forEach((fieldName) => {
              this.recoveryForm.controls[fieldName].setErrors({backend: data[fieldName]});
          });
        }
      });
    }
  }

  forgetPasswordUpdate(value){
    this.circleSpin = true;

    this.passwordForm.controls["phone"].markAsTouched();
    this.passwordForm.controls["code"].markAsTouched();
    this.passwordForm.controls['password'].markAsTouched();
    this.passwordForm.controls['confirm_password'].markAsTouched();

    if(this.passwordForm.valid){
      let body = value;
      this.authService.forgetPasswordUpdate(body).subscribe(response => {
        this.circleSpin = false;

        if(response['success']){
          this.toastr.success(response['success']['message'], 'Success', {
            closeButton: true,
            timeOut:5000
          });
          this.router.navigate([""]);
        }
      },error => {
        this.circleSpin = false;

        this.toastr.error('Something went wrong!', 'Error', {
          closeButton: true
        });
        if(error.status == 401 && error.statusText == "Unauthorized"){
          this.authService.tokenExpired();
        }

        let data = error.error.error.message;

        Object.keys(data).forEach((fieldName) => {
            this.passwordForm.controls[fieldName].setErrors({backend: data[fieldName]});
        });
      });
    }
  }
} 

