import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IndividualService } from '../../services/individual.service';
import { AuthService } from '../../services/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { responsiveService } from "../../services/responsive.service";
import * as $ from "jquery";
declare var $: any;

@Component({
  selector: 'app-individual-settings',
  templateUrl: './individual-settings.component.html',
  styleUrls: ['./individual-settings.component.css']
})

export class IndividualSettingsComponent implements OnInit {
  public circleSpin = false;
  public dateValue:any;
  public hasData = false;
  public CompanyData:any;
  minDate = {year: 1940, month: 1, day: 1};
  public showErrorModal = false;
  public setttingsForm: FormGroup;

  public isMobile: Boolean; //responsive checker
  
  @Output() sendSuccessType : EventEmitter <boolean> = new EventEmitter<boolean>();
  
  constructor(
    private responsiveService: responsiveService,
    private errorHandler:ErrorHandlerService,
    private _fb: FormBuilder,
    public service:IndividualService,
    private authService: AuthService,
    private toastr: ToastrService
  ) { 
    this.getSettingsData();
  }

  ngOnInit() {
    this.setttingsForm = this._fb.group({
      name: '',
      email: ['',[Validators.pattern(/[^ @]*@[^ @]*$/)]],
      phone: '',
    });

    //responsive checker
    this.onResize();
    this.responsiveService.checkWidth();

    $(".modal").modal("hide");
  }

  //responsive checker
  onResize() {
    this.responsiveService.getMobileStatus().subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }

  getSettingsData(){
    let token_parsed = this.authService.getToken();
    let options = {headers: new  HttpHeaders({ 'Authorization': 'Bearer ' +token_parsed})};
    this.service.getIndividualSettingsData(options).subscribe(response => {
      this.setttingsForm = this._fb.group({
        name: response['data'].name,
        email: [response['data'].email, [Validators.pattern(/[^ @]*@[^ @]*$/)]],
        phone: response['data'].phone,
      });
    },error => {
      this.showErrorModal = this.errorHandler.errorHandleFunction(error);
    });
  }

  submitComapnySettings() {
    if (this.setttingsForm.valid) {
      this.circleSpin = true;
      let token_parsed = this.authService.getToken();
      let options = {headers: new  HttpHeaders({ 'Authorization': 'Bearer ' +token_parsed})};
  
      this.service.postIndividualSettingsData(this.setttingsForm.value,options).subscribe(response => {
        this.circleSpin = false;
        localStorage.setItem('name',this.setttingsForm.value.name);
  
        this.toastr.success('Settings changed!', '',{
          closeButton: true
        });
      },
      error => {
        this.circleSpin = false;
        
        if(error.status == 401 && error.statusText == "Unauthorized"){
          this.authService.tokenExpired();
        }
        
        let data = error.error.error.message;
          Object.keys(data).forEach((fieldName) => {
            this.setttingsForm.controls[fieldName].setErrors({backend: data[fieldName]});
        });
      });
    }
  }
}
