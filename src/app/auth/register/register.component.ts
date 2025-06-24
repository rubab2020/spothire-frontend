import { Component, OnInit } from "@angular/core";
import {
  trigger,
  state,
  animate,
  style,
  transition,
} from "@angular/animations";
import { environment } from "../../../environments/environment";
import * as $ from "jquery";
declare var $: any;
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { GoogleAnalyticsService } from "../../services/google-analytics.service";
import { RegistrationService } from "../../services/registration.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";


@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
  animations: [
    trigger("showHello", [
      state(
        "true",
        style({
          opacity: 1,
        })
      ),
      state(
        "false",
        style({
          opacity: 0,
        })
      ),
      transition("1 => 0", animate("350ms ease-in")),
      transition("0 => 1", animate("350ms ease-out")),
    ]),
  ],
})
export class RegisterComponent implements OnInit {
  public showIndividual = true;
  public showCompany = false;
  errors = [];
  private INDV_NAME = environment.individualName;
  private COMP_NAME = environment.companyName;
  public circleSpin = false;
  PolicyViewType = null;
  public regForm: FormGroup;
  
  constructor(
    private _fb: FormBuilder, 
    private googleAnalyticsService: GoogleAnalyticsService,
    private regService: RegistrationService,
    private router: Router,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.regForm = this._fb.group({
      phone: [
        "",
        [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
          Validators.pattern(/^[0-9 ]*$/),
        ]
      ],
      role:this.INDV_NAME
    });
  }

  changeToCompany() {
    this.showIndividual = false;
    this.showCompany = true;
  }

  changeToIndividual() {
    this.showIndividual = true;
    this.showCompany = false;
  }

  createAccount(value: any) {
    this.regForm.controls["phone"].markAsTouched();

    this.googleAnalyticsService.emitEvent("registration", "register", null, null);

    if (this.regForm.valid) {
      this.circleSpin = true;

      if(this.showCompany)
        this.regForm.value.role = this.COMP_NAME;
      else
        this.regForm.value.role = this.INDV_NAME;

      let body = JSON.stringify(value);

      this.regService.createUser(body).subscribe(
        (response) => {
          this.circleSpin = false;
          if (response["success"]) {
            this.regForm.reset();
            this.circleSpin = false;
            this.router.navigate(["verify", value['phone']]);
          }
        },
        (error) => {
          this.circleSpin = false;

          let data = error.error.error.message;
          Object.keys(data).forEach((fieldName) => {
            this.regForm.controls[fieldName].setErrors({
              backend: data[fieldName],
            });
          });
        }
      );
    }
  }

  showPolicyModal(type) {
    this.PolicyViewType = type;
  }

  showLogin() {
    $("#loginModal").modal("show");
  }

  closeModal() {
    $("#policyModal").modal("hide");
  }
}
