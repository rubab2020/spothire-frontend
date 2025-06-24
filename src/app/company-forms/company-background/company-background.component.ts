import { ErrorHandlerService } from './../../services/error-handler.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { IndividualService } from '../../services/individual.service';
import { CompanyService } from '../../services/company.service';
import { AuthService } from '../../services/auth.service';
import { responsiveService } from '../../services/responsive.service';
import * as $ from "jquery";
declare var $: any;

@Component({
  selector: 'app-company-background',
  templateUrl: './company-background.component.html',
  styleUrls: ['./company-background.component.css']
})

export class CompanyBackgroundComponent implements OnInit {
  backgroundForm: FormGroup;
  public showErrorModal = false;
  loading = false;
  public isMobile: Boolean; //responsive checker

  constructor(
    private responsiveService: responsiveService,
    private errorHandler:ErrorHandlerService,
    private fb: FormBuilder,
    private compService: CompanyService,
    private authService: AuthService
  ){
      this.createForm();
      this.getCompanyBackGround();
  }

  ngOnInit() {
    //responsive checker
    this.onResize();
    this.responsiveService.checkWidth();
  }

  //responsive checker
  onResize() {
    this.responsiveService.getMobileStatus().subscribe(isMobile => {
      this.isMobile = isMobile;
    });
  }

  createForm() {
    this.backgroundForm = this.fb.group({
      industry: null,
      location: null,
      location_data: null,
      inception_date: null,
      annual_turnover: null
    });
  }

  getCompanyBackGround(){
    this.loading = true;

    let token_parsed = this.authService.getToken();
    let options = {headers: new  HttpHeaders({ 'Authorization': 'Bearer ' +token_parsed})};
    this.compService.getCompanyBackgroundData(options).subscribe(response => {
      let date = response['data'].inception_date ? new Date(response['data'].inception_date) : null;
      this.backgroundForm = this.fb.group({
        industry: response['data'].industry,
        location: response['data'].location,
        location_data: null,
        inception_date: date,
        annual_turnover: response['data'].annual_turnover
      });
      this.loading = false;
    },error => {
      this.showErrorModal = this.errorHandler.errorHandleFunction(error);
      this.loading = false;
    });
  }

  onSubmit(values:any){
    if(this.loading) return;

    let date = '';
    if(values['inception_date'] && values['inception_date'] !== "" && values['inception_date'] !== null){
      const dt = new Date(values['inception_date']);
      date = dt.getFullYear()+'-'+(dt.getMonth()+1)+'-'+dt.getDate();
    }
    values['inception_date'] = date;

    let token_parsed = this.authService.getToken();
    let option = {headers: new  HttpHeaders({ 'Authorization': 'Bearer ' +token_parsed})};
    this.compService.postCompanyBackgroundData(values,option).subscribe(response => {});
  }

  resetDateInput(index){
    this.backgroundForm.get('inception_date').setValue('');
  }
}