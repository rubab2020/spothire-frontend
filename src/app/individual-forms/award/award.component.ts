import { ErrorHandlerService } from '../../services/error-handler.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { IndividualService } from '../../services/individual.service';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { MatChipInputEvent } from '@angular/material/chips';
import {ENTER, COMMA} from '@angular/cdk/keycodes';
import {NgSelectModule, NgOption} from '@ng-select/ng-select';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SwiperComponent, SwiperDirective, SwiperConfigInterface,
  SwiperScrollbarInterface, SwiperPaginationInterface } from 'ngx-swiper-wrapper';
import { responsiveService } from '../../services/responsive.service';
import * as $ from "jquery";
declare var $ : any;

@Component({
  selector: 'app-award',
  templateUrl: './award.component.html',
  styleUrls: ['./award.component.css']
})

export class AwardComponent implements OnInit {
  public awardForm: FormGroup;
  public showErrorModal = false;
  countCheckAward = 0;
  public workerProfile = null;
  loading = false;
  previewLoading = false;
  public isMobile: Boolean; //responsive checker
  
  defaultProfImg:any = "../assets/images/default_profile.png";
  defaultCoverPhoto:any = "../assets/images/default_cover.png";
  defaultCompImg:any = "../assets/images/default_company.png";
  defaultEducationImg:any = "../assets/images/default-education.png";
  defaultAwardImg:any = "../assets/images/default_award.png";

  public config: SwiperConfigInterface = {
    a11y: true,
    direction: 'horizontal',
    slidesPerView: 'auto',
    keyboard: true,
    mousewheel: true,
    scrollbar: false,
    navigation: false,
    pagination: true
  };

  constructor(
    private responsiveService: responsiveService,
    private errorHandler:ErrorHandlerService,
    private toastr: ToastrService,
    private _fb: FormBuilder,
    private indService: IndividualService,
    private authService: AuthService,
    private router: Router
  ){
    this.getAwardsdata();
  }

  ngOnInit() {
    this.awardForm = this._fb.group({
      awards: this._fb.array([this.initaward()])
    });

    //responsive checker
    this.onResize();
    this.responsiveService.checkWidth();

    $(".modal").modal("hide");
  }

  //responsive checker
  onResize() {
    this.responsiveService.getMobileStatus().subscribe(isMobile => {
      this.isMobile = isMobile;
    });
  }

  initaward() {
    return this._fb.group({
      id: null,
      title: '',
      institution: '',
      date: ''
    });
  }

  getAwardsdata(){
    this.loading = true;
    
    let token_parsed = this.authService.getToken();
    let options = {headers: new  HttpHeaders({ 'Authorization': 'Bearer ' +token_parsed})};

    this.indService.getAwards(options).subscribe(response => {
      if(Object.keys(response['data']).length >0){
        const control_award = <FormArray>this.awardForm.controls['awards'];
        control_award.controls = [];

        response['data'].forEach(element => {
          control_award.push(this.dataPushAward(element));
          this.countCheckAward++;
        });
      }
      this.loading = false;
    },error => {
      this.showErrorModal = this.errorHandler.errorHandleFunction(error);
      this.loading = false;
    });
  }

  dataPushAward(element) {
    let date = element.date ? new Date(element.date) : null;
    return this._fb.group({
      id :element.id,
      title: element.title,
      institution: element.institute,
      date: date,
    });
  }
  
  onSubmit(values:any, actionType:any) {
    if(!this.loading){
      values['awards'].forEach(element => {
        if(element.date !== "" && element.date !== null){
          const date = new Date(element.date);
          element.date = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        }else{
          element.date = null;
        }
      });

      let token_parsed = this.authService.getToken();
      let option = {headers: new  HttpHeaders({ 'Authorization': 'Bearer ' +token_parsed})};
      this.indService.postAwards(values['awards'],option).subscribe(response => {
        if(Object.keys(response['data']).length >0){
          const fromControl = <FormArray>this.awardForm.controls['awards'];
          fromControl.controls = [];
  
          response['data'].forEach(element => {
            fromControl.push(this.dataPushAward(element));
          });
        }
      });
    }

    if(actionType == 'finish-profile'){
      this.router.navigate(["hire-or-serve"]);
    }
  }

  allFieldsEmpty(awards){
    let count = 0;
    for(let award of awards){
      if(
        award.id == null &&
        award.title == null &&
        award.institution == null &&
        award.date == null
      ){
        count++;
      }
    }
    return count == awards.length ? true : false;
  }
  
  // also available in hire-applied component
  getEducationName() {
    if(this.workerProfile.qualifications.length > 0) {
      return this.workerProfile.qualifications[0].degree;
    }
    else{
      return null;
    }
  }
  
  // also available in hire-applied component
  getInstituteName() {
    if(this.workerProfile.qualifications.length > 0){
      return this.workerProfile.qualifications[0].institution;
    }
    else{
      return null;
    }
  }

  addRow() {
    const control = <FormArray>this.awardForm.controls['awards'];
    control.push(this.initaward());
    this.countCheckAward++;
    $("html, body").animate({ scrollTop: $(document).height() }, "slow");
  }

  deleteRow(index: number) {
    const control = <FormArray>this.awardForm.controls['awards'];
    let value = {
      id: control.value[index].id
    }

    control.removeAt(control.length-1);
    this.countCheckAward--;

    if(value.id !== undefined && value.id !== null  && value.id !== ""){
      let token_parsed = this.authService.getToken();
      let option = {headers: new  HttpHeaders({ 'Authorization': 'Bearer ' +token_parsed})};
      this.indService.postDeleteAward(value,option).subscribe(response => {
      },
      error => {
        let message = "Failed deleting award. Pelase try again";
        this.toastr.error(message, 'Error', {
          closeButton: true
        });
      });
    }
  }

  // also avialable in write offer
  dateFormat(date) {
    if(date == null) return;

    if(!date.getMonth) 
      date = new Date(date+'T00:00:00Z');
    
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    var monthNames = [
      "Jan", "Feb", "Mar",
      "Apr", "May", "Jun", "Jul",
      "Aug", "Sep", "Oct",
      "Nov", "Dec"
    ];

    return monthNames[monthIndex] + ' ' + day + ', ' + year;
  }

  resetDateInput(index){
    const periodFrom = this.awardForm.controls['awards']['controls'][index]['controls']['date'];
    periodFrom.setValue('');
  }

  // also in hire assigned
  countSiteEmployers(experiences){
    return experiences.filter(experience => experience.application_id != null).length;
  }

  // also in hire-assigned
  decodePhone(phone){
    return atob(phone);
  }
}
