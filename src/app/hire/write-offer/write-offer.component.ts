import { Component, OnInit, ViewChild } from "@angular/core";
import {FormGroup, FormControl, FormBuilder, FormArray, Validators} from "@angular/forms";
declare var $: any;
import { MatStepper } from "@angular/material";
import { HttpHeaders } from "@angular/common/http";
import { AuthService } from "../../services/auth.service";
import { WriteOfferService } from "../../services/write-offer.service";
import { Router, ActivatedRoute } from "@angular/router";
import { responsiveService } from "../../services/responsive.service";
import { ErrorHandlerService } from "./../../services/error-handler.service";
import { environment } from "../../../environments/environment";
import { JwtHelperService } from "@auth0/angular-jwt";
import { ToastrService } from "ngx-toastr";
import { CommonService } from "../../services/common.service";
import { JobDetailsService } from "../../services/job-details.service";
import { select } from "@angular-redux/store";

@Component({
  selector: "app-write-offer",
  templateUrl: "./write-offer.component.html",
  styleUrls: ["./write-offer.component.css"],
})
export class WriteOfferComponent implements OnInit {
  @select() threadsUnseenMsgs;
  @ViewChild("stepper") stepper: MatStepper;

  circleSpin = false;

  private API_URL = environment.apiUrl;
  private HIRE_APPLIED_SECTION = environment.sectionNames.HIRE_APPLIED_SECTION;
  private HIRE_HIRED_SECTION = environment.sectionNames.HIRE_HIRED_SECTION;

  hasHireAppliedSectionNotif = false;
  hasHireHiredSectionNotif = false;

  isFormSubmitted: boolean = false;
  public workForm: FormGroup;

  defaultProfImg: any = "../assets/images/default_profile.png";
  defaultCoverPhoto: any = "../assets/images/default_cover.png";

  public result: any;
  selectedEmploymentType = null;
  selectedSalaryType = null;
  selectedDepartment = null;
  selectedMinimumExperience = null;
  selectedMinimumQualification = null;
  selectedLocation = null;
  selectedSkills = [];
  public isMobile: Boolean; //responsive checker
  public minDate = { year: 1940, month: 1, day: 1 };
  tags = [{}];
  public showErrorModal = false;
  private INDV_NAME = environment.individualName;
  private COMP_NAME = environment.companyName;

  advertDays = [];
  departments = [];
  days = [];
  employmentTypes = [];
  salaryTypes = [];
  experiences = [];
  qualifications = [];
  locations = [];

  errors = [];
  public showIndividual = true;
  public showCompany = false;

  public user: any;
  public token: any;
  public profilePicture: string;
  public coverPhoto: string;
  public jobId = null;

  chatNotifications = [];
  statusOfApplications = [];

  loading:boolean = false;

  constructor(
    private responsiveService: responsiveService,
    private _fb: FormBuilder,
    public authService: AuthService,
    private writeOfferservice: WriteOfferService,
    private route: ActivatedRoute,
    private router: Router,
    private errorHandler: ErrorHandlerService,
    private toastr: ToastrService,
    private cmnService: CommonService,
    private jobDetailsService: JobDetailsService
  ) {
    const jwtHelper = new JwtHelperService();
    this.token = authService.getToken();
    this.user = jwtHelper.decodeToken(this.token);
    this.user.profile_picture = authService.getImage();
    this.user.cover_photo = authService.getCoverPhoto();
    this.user.id = authService.getId();
  }

  ngOnInit() {
    this.isFormSubmitted = false;

    //responsive checker
    this.onResize();
    this.responsiveService.checkWidth();

    this.initJob();

    this.route.queryParams
    .filter((params) => params.id)
    .subscribe((params) => {
      if (params.id !== null) {
        this.jobId = params.id;
        this.getJobData(params.id);
      }
    });

    $(".modal").modal("hide");
  }
  
  //responsive checker
  onResize() {
    this.responsiveService.getMobileStatus().subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }

  initJob() {
    this.workForm = this._fb.group({
      job_title: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/[a-zA-Z-,()]$/)]],
      employment_type: [null, Validators.required],
      start_date: null, // null instead of empty string is for ngbdatepicker
      end_date: null, 
      salary_from: [null, [Validators.required, Validators.pattern(/^[0-9 ]*$/)]],
      salary_to: [null, [Validators.pattern(/^[0-9 ]*$/)]],
      salary_type: [null, Validators.required],
      is_salary_negotiable: false,
      address: '',
      department: [null, Validators.required],
      min_experience: [null, Validators.required],
      min_qualification: [null, Validators.required],
      skills: [[]],
      description: ['', Validators.required],
      requirements: '',
      advert_duration: [30, Validators.required],
      location: [null, Validators.required]
    },
    {validator: [
      this.cmnService.dateLessThan('start_date', 'end_date'), 
    ]});

    this.getOptions();
  }

  getJobData(id) {
    let token_parsed = this.authService.getToken();
    let options = {
      headers: new HttpHeaders({ Authorization: "Bearer " + token_parsed }),
    };
    this.writeOfferservice.getEditJobData(id, options).subscribe(
      (response) => {
        const job = response["data"];

        this.selectedSkills = job.skills.map((item) => item.name);

        this.workForm = this._fb.group(
          {
            job_title: job.job_title,
            employment_type: job.employment_type,
            start_date: job.start_date,
            end_date: job.end_date,
            salary_from: job.salary_from,
            salary_to: job.salary_to,
            salary_type: job.salary_type,
            is_salary_negotiable: job.is_salary_negotiable,
            address: job.address,
            department: job.department,
            min_experience: job.min_experience,
            min_qualification: job.min_qualification,
            skills: [this.selectedSkills],
            description: job.description,
            requirements: job.requirements,
            advert_duration: job.advert_duration,
            location: job.location
          },
          {
            validator: [
              this.cmnService.dateLessThan("start_date", "end_date"),
            ],
          }
        );
      },
      (error) => {
        if (error.status == 401 && error.statusText == "Unauthorized") {
          this.authService.tokenExpired();
        }
      }
    );
  }

  getOptions() {
    this.loading = true;
    let token_parsed = this.authService.getToken();
    let options = {
      headers: new HttpHeaders({ Authorization: "Bearer " + token_parsed }),
    };
    this.writeOfferservice.getJobOptions(options).subscribe(
      (response) => {
        this.loading = false;

        this.tags = response["tags"];
        this.advertDays = response["advert_days"];
        this.departments = response["departments"];
        this.days = response["days"];
        this.employmentTypes = response["employment_types"];
        this.salaryTypes = response["salary_types"];
        this.experiences = response["experiences"];
        this.qualifications = response["qualifications"];
        this.locations = response['locations'];
      },
      (error) => {
        this.showErrorModal = this.errorHandler.errorHandleFunction(error);
      }
    );
  }

  onSubmit() {
    this.circleSpin = true;

    let formData = { ...this.workForm.value };

    if (this.jobId) {
      formData["id"] = this.jobId;
    }

    if (formData.start_date) {
      let startDate = new Date(formData.start_date);
      formData.start_date = this.cmnService.customDateFormat(startDate);
    }

    if (formData.end_date) {
      let endDate = new Date(formData.end_date);
      formData.end_date = this.cmnService.customDateFormat(endDate);
    }

    let token_parsed = this.authService.getToken();
    let options = {
      headers: new HttpHeaders({ Authorization: "Bearer " + token_parsed }),
    };
    this.writeOfferservice.postJobData(formData, options).subscribe(
      (response) => {
        this.circleSpin = false;
        this.toastr.success('Thanks for your job post. The ad will remain for 30 days once it has been approved.', "Success", {
          closeButton: true,
        });
        this.router.navigate(["hire/applied"]);
      },
      (error) => {
        this.circleSpin = false;
        if (error.status == 400) {
          this.toastr.error(error.error.error.message, "Error", {
            closeButton: true,
          });
        } else if (error.statusText == "Unathorized") {
          this.authService.tokenExpired();
        }
      }
    );
  }

  moveStepper(index: number) {
    this.stepper.selectedIndex = index;
  }

  checkFieldsErrors() {
    this.isFormSubmitted = true;

    if (!this.workForm.valid) 
      $("#fieldsErrorModal").modal("show");
    else 
      $("#jobPreviewModal").modal("show");
  }

  dummyDataLoad() {
    // dummy data
    this.workForm = this._fb.group({
      job_title: "Software Engineer",
      employment_type: "Permanent (Full-Time)",
      start_date: "2020-03-17",
      end_date: "2020-03-17",
      salary_from: "20000",
      salary_to: "30000",
      salary_type: "Month",
      is_salary_negotiable: false,
      address: "house 11, road 12, sector 4, uttara, dhaka, bangladesh",
      department: "IT & Telecommunication",
      min_experience: "1-3 years",
      min_qualification: "Bechelor",
      skills: [
        [
          "Cloud and distributed computing",
          "Cloud Computing",
          "Amazon Web Services",
        ],
      ],
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Exercitationem eveniet, numquam laudantium temporibus accusamus, illum minus porro sunt quo, asperiores iure totam? Nostrum vitae consequatur dolorum quia sapiente exercitationem odio?",
      requirements:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Exercitationem eveniet, numquam laudantium temporibus accusamus, illum minus porro sunt quo, asperiores iure totam? Nostrum vitae consequatur dolorum quia sapiente exercitationem odio?",
      advert_duration: 30,
      location: null,
    });
    this.selectedEmploymentType = "Permanent (Full-Time)";
    this.selectedLocation = "Dhaka";
    this.selectedSalaryType = "Month";
    this.selectedDepartment = "IT & Telecommunication";
    this.selectedMinimumExperience = "1-3 years";
    this.selectedMinimumQualification = "Bachelors Degree";
    this.selectedSkills = [
      "Cloud and distributed computing",
      "Cloud Computing",
      "Amazon Web Services",
    ];
  }
}
