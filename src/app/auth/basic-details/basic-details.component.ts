import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms"
import { Router } from '@angular/router';
import { RegistrationService } from '../../services/registration.service';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { HttpHeaders } from "@angular/common/http";
import * as $ from "jquery";
import { JwtHelperService } from '@auth0/angular-jwt';
declare var $ : any;


@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.css']
})
export class BasicDetailsComponent implements OnInit {
  basicForm: FormGroup;
  togglePasswordIcon = false;
  public circleSpin = false;
  public INDV_NAME = environment.individualName;
  public COMP_NAME = environment.companyName;
  public user: any;
  public token: any;

  constructor(
    private fb: FormBuilder, 
    private regService: RegistrationService, 
    private router: Router,
    private authService: AuthService
  ) {
    const jwtHelper = new JwtHelperService();
    this.token = this.authService.getToken();
    this.user = jwtHelper.decodeToken(this.token);
   }

  ngOnInit() {
    this.basicForm = this.fb.group({
      name: [
        "",
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(/[a-zA-Z-,()]$/),
        ],
      ],
      email: ["", [Validators.pattern(/[^ @]*@[^ @]*$/)]],
      phone: this.user.phone,
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/(?=\D*\d)(?=[^a-z]*[a-z])/),
        ],
      ],
    });

    $('.modal').modal('hide');
    $('.modal-backdrop').remove();
  }

  showPassword(input: any): any {
    input.type = input.type === 'password' ?  'text' : 'password';
    this.togglePasswordIcon = !this.togglePasswordIcon;
  }

  saveBasicInfo(value: any) {
    this.basicForm.controls["name"].markAsTouched();
    this.basicForm.controls["email"].markAsTouched();
    this.basicForm.controls["password"].markAsTouched();

    if (this.basicForm.valid) {
      this.circleSpin = true;
      let body = JSON.stringify(value);
      let token_parsed = this.authService.getToken();
      let options = {
        headers: new HttpHeaders({ Authorization: "Bearer " + token_parsed }),
      };
      this.regService.postBasicDetails(body, options).subscribe(
        (response) => {
          this.circleSpin = false;
          if (response["success"]) {
            this.basicForm.reset();
            this.circleSpin = false;

            localStorage.setItem('name', response["success"]['data']['name']);
            localStorage.setItem('email', response["success"]['data']['email']);

            if(this.user.user_type == this.INDV_NAME)
              this.router.navigate(["individual/about-yourself"]);
            else
              this.router.navigate(["company/introduction"]);
          }
        },
        (error) => {
          this.circleSpin = false;

          if (error.status == 401 && error.statusText == "Unauthorized") {
            this.authService.tokenExpired();
          }

          let data = error.error.error.message;
          Object.keys(data).forEach((fieldName) => {
            this.basicForm.controls[fieldName].setErrors({
              backend: data[fieldName],
            });
          });
        }
      )
    }
  }
}