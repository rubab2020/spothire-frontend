import {
  Component,
  OnInit,
  AfterContentInit,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from "@angular/core";
import { RegistrationService } from "../../../services/registration.service";
import { EqualValidatorDirective } from "../../../equal-validator.directive";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { GoogleAnalyticsService } from "../../../services/google-analytics.service";
import { responsiveService } from "../../../services/responsive.service";
import * as $ from "jquery";
declare var $: any;

@Component({
  selector: "app-individual-register",
  templateUrl: "./individual-register.component.html",
  styleUrls: ["./individual-register.component.css"],
})
export class IndividualRegisterComponent implements AfterViewInit {
  public isMobile: Boolean; //responsive checker
  formErrors = {}; // object to store error messages
  verificationCode: string;
  recaptchaVerifierData: any;
  showEnterCode = false;
  showCapcha = true;
  public all_errors = [];
  public responseData: any;
  public indForm: FormGroup;
  public formValid = true;
  userNumber: any;
  public circleSpin = false;
  @Output() messageEvent = new EventEmitter();
  showRegisterFields = true;
  @Input() redirectUrl: string;
  PolicyViewType = null;
  togglePasswordIcon = false;

  constructor(
    private responsiveService: responsiveService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private _fb: FormBuilder,
    private regService: RegistrationService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private toastr: ToastrService
  ) {}

  //responsive checker
  onResize() {
    this.responsiveService.getMobileStatus().subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }

  ngOnInit() {
    //responsive checker
    this.onResize();
    this.responsiveService.checkWidth();

    this.indForm = this._fb.group({
      name: [
        "",
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(/[a-zA-Z-,()]$/),
        ],
      ],
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

  // also in comp-register
  showPassword(input: any): any {
    input.type = input.type === 'password' ?  'text' : 'password';
    this.togglePasswordIcon = !this.togglePasswordIcon;
  }

  createIndividualAccount(value: any) {
    value.role = "individual";

    this.indForm.controls["name"].markAsTouched();
    this.indForm.controls["email"].markAsTouched();
    this.indForm.controls["phone"].markAsTouched();
    this.indForm.controls["password"].markAsTouched();

    this.googleAnalyticsService.emitEvent(
      "registration",
      "individual-register",
      null,
      null
    );

    if (this.indForm.valid) {
      this.circleSpin = true;
      let body = JSON.stringify(value);

      this.regService.createUser(body).subscribe(
        (response) => {
          this.circleSpin = true;
          this.messageEvent.emit([]);
          if (response["success"]) {
            this.indForm.reset();
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
            this.indForm.controls[fieldName].setErrors({
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
