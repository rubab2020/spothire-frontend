import {
  Component,
  OnInit,
  AfterViewInit,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from "@angular/core";
import { RegistrationService } from "../../../services/registration.service";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { JwtHelperService } from "@auth0/angular-jwt";
import { ToastrService } from "ngx-toastr";
import { GoogleAnalyticsService } from "../../../services/google-analytics.service";
import * as $ from "jquery";
declare var $: any;

@Component({
  selector: "app-company-register",
  templateUrl: "./company-register.component.html",
  styleUrls: ["./company-register.component.css"],
})
export class CompanyRegisterComponent implements AfterViewInit {
  public compForm: FormGroup;
  @Output() messageEvent = new EventEmitter();
  userNumber: any;
  showEnterCode = false;
  showCapcha = true;
  public responseData: any;
  recaptchaVerifierData: any;
  public all_errors = [];
  verificationCode: string;
  public formValid = true;
  showRegisterFields = true;
  public circleSpin = false;
  PolicyViewType = null;
  togglePasswordIcon = false;

  constructor(
    private googleAnalyticsService: GoogleAnalyticsService,
    private _fb: FormBuilder,
    private toastr: ToastrService,
    private regService: RegistrationService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.compForm = this._fb.group({
      name: ["", [Validators.required, Validators.maxLength(50)]],
      email: ["", [Validators.required, Validators.pattern(/[^ @]*@[^ @]*$/)]],
      phone: [
        "",
        [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
          Validators.pattern(/^[0-9 ]*$/),
        ],
      ],
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/(?=\D*\d)(?=[^a-z]*[a-z])/),
        ],
      ],
    });
  }

  ngAfterViewInit() {}

  showPassword(input: any): any {
    input.type = input.type === 'password' ?  'text' : 'password';
    this.togglePasswordIcon = !this.togglePasswordIcon;
  }

  createCompanyAccount(value: any) {
    value.role = "company";
    this.compForm.controls["name"].markAsTouched();
    this.compForm.controls["email"].markAsTouched();
    this.compForm.controls["phone"].markAsTouched();
    this.compForm.controls["password"].markAsTouched();

    this.googleAnalyticsService.emitEvent(
      "registration",
      "company-register",
      null,
      null
    );

    if (this.compForm.valid) {
      this.circleSpin = true;
      let body = JSON.stringify(value);

      this.regService.createCompanyUser(body).subscribe(
        (response) => {
          this.circleSpin = true;
          this.messageEvent.emit([]);
          if (response["success"]) {
            this.compForm.reset();
            this.circleSpin = false;
            this.toastr.success(response["success"]["message"], "Success", {
              closeButton: true,
              timeOut: 0,
            });
            this.router.navigate([""]);
          }
        },
        (error) => {
          this.circleSpin = false;

          let data = error.error.error.message;
          Object.keys(data).forEach((fieldName) => {
            this.compForm.controls[fieldName].setErrors({
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

  closeModal() {
    $("#policyModal").modal("hide");
  }
}
