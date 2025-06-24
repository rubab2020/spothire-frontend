import { ErrorHandlerService } from './../../services/error-handler.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { IndividualService } from '../../services/individual.service';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { MatChipInputEvent } from '@angular/material/chips';
import {ENTER, COMMA} from '@angular/cdk/keycodes';
import {NgSelectModule, NgOption} from '@ng-select/ng-select';
import { Router } from '@angular/router';
import { SwiperComponent, SwiperDirective, SwiperConfigInterface,
  SwiperScrollbarInterface, SwiperPaginationInterface } from 'ngx-swiper-wrapper';
import { a } from '@angular/core/src/render3';
import { ToastrService } from 'ngx-toastr';
import { responsiveService } from '../../services/responsive.service';
import { environment } from "../../../environments/environment";
import * as $ from "jquery";
  
@Component({
  selector: 'app-work-experience',
  templateUrl: './work-experience.component.html',
  styleUrls: ['./work-experience.component.css']
})

export class WorkExperienceComponent implements OnInit {
  private MAX_IMAGE_UPLOAD = environment.maxImageUpload;
  imageUpload:any = "../assets/images/upload.png";

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

  countCheck = 0;
  public workForm: FormGroup;
  public showErrorModal = false;
  employers:any;
  occupationList:any;
  loading = false;
  public isMobile: Boolean; //responsive checker

  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(
    private errorHandler:ErrorHandlerService,
    private responsiveService: responsiveService,
    private toastr: ToastrService,
    private _fb: FormBuilder,
    private indService: IndividualService,
    private authService:AuthService,
    private router: Router) { 
      this.getWorkExperience();
  }

  ngOnInit() {
    this.workForm = this._fb.group({
      experiences: this._fb.array([this.initexperience()])
    });

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

  initexperience() {
    return this._fb.group({
      id: null,
      application_id: null,
      occupation: '',
      employer: '',
      period_from: '',
      period_to: '',
      work_images: this._fb.array([])
    });
  }

  getWorkExperience(){
    this.loading = true;

    let token_parsed = this.authService.getToken();
    let options = {headers: new  HttpHeaders({ 'Authorization': 'Bearer ' +token_parsed})};
    
    this.indService.getWorkExperience(options).subscribe(response => {
      this.employers = response['employers'].filter(item => item.is_active);
      this.occupationList = response['occupations'].filter(item => item.is_active);
      
      if(Object.keys(response['data']).length > 0){
        const formControl = <FormArray>this.workForm.controls['experiences'];
        formControl.controls = [];
        response['data'].forEach((element,index) => {
          formControl.push(this.dataPush(element,index));
          this.countCheck++;
        });
      }

      this.loading = false;

      if(this.MAX_IMAGE_UPLOAD == 1)
        this.config.pagination = false;
    },error => {
      this.showErrorModal = this.errorHandler.errorHandleFunction(error);
      this.loading = false;
    });
  }

  dataPush(element,index){
    let dateFrom = element.period_from ? new Date(element.period_from) : null;
    let dateTo = element.period_to ? new Date(element.period_to) : null;
    
    return this._fb.group({
      id: element.id,
      application_id: element.application_id,
      occupation : element.occupation,
      employer: element.employer,
      period_from: dateFrom ? dateFrom : "",
      period_to: dateTo ? dateTo : "",
      work_images: element.work_images.length > 0 ? this._fb.array(element.work_images) : this._fb.array([])
    })
  }

  onSubmit(values:any) {
    if(this.loading) return;

    // prepare data
    let formCnt = 0;
    let allImages = [];
    values['experiences'].forEach(element => {
      // period from
      if(element.period_from !== "" && element.period_from !== null && element.period_from !== undefined){
        const date = new Date(element.period_from);
        element.period_from = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
      }else{
        element.period_from = null;
      }

      // period to
      if(element.period_to !== "" && element.period_to !== null && element.period_to !== undefined){
        const date = new Date(element.period_to);
        element.period_to = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
      }else{
        element.period_to = null;
      }

      // create 4 images fileds for work images
      for(let i = 0; i < this.MAX_IMAGE_UPLOAD; i++) {
        if(typeof element.work_images[i] === 'undefined'){
          element.work_images.push({id: null, image: null});
        }
      }
      for(let imgCnt = 0; imgCnt < this.MAX_IMAGE_UPLOAD; imgCnt++){
        let img = (<HTMLInputElement>document.getElementById(`workImg_${formCnt}${imgCnt}`)).getAttribute('value');
        if(img == 'delete'){
          element.work_images[imgCnt].image = 'delete';
        }
        else{
          if(img) {
            element.work_images[imgCnt].image = 'save_image';
            allImages.push((<HTMLInputElement>document.getElementById(`workImg_${formCnt}${imgCnt}`)).files[0]);
          }
          else
            element.work_images[imgCnt].image = null;
        }
        
        let desc = ((document.getElementById(`workDescription_${formCnt}${imgCnt}`) as HTMLInputElement).value);
        element.work_images[imgCnt].description = desc;
      }
      
      formCnt += 1;
    });

    const formData = new FormData();
    formData.append('data', JSON.stringify(values['experiences']));
    allImages.forEach(file => formData.append('images[]', file));

    // save experiences
    let token_parsed = this.authService.getToken();
    let option = {headers: new  HttpHeaders({ 'Authorization': 'Bearer ' +token_parsed})};
    
    this.indService.postWorkExperience(formData,option).subscribe(response => {
      if(Object.keys(response['data']).length >0){
        const formControl = <FormArray>this.workForm.controls['experiences'];
        formControl.controls = [];
        response['data'].forEach((element,index) => {
          formControl.push(this.dataPush(element,index));
        });
      }
    });
  }

  noImages(items){
    let count = 0;
    for(let item of items){
      if(item.image == null) count ++;
    }
    return count == items.length ? true : false
  }

  addNewRow() {
    const formControl = <FormArray>this.workForm.controls['experiences'];
    formControl.push(this.initexperience());
    this.countCheck++;
    $("html, body").animate({ scrollTop: $(document).height() }, "slow");
  }
  
  deleteRow(index: number) {
    const formControl = <FormArray>this.workForm.controls['experiences'];
    let value = {
      work_id: formControl.value[index].id
    }

    formControl.removeAt(index);
    this.countCheck--;

    if(value.work_id !== undefined && value.work_id !== null  && value.work_id !== ""){
      let token_parsed = this.authService.getToken();
      let option = {headers: new  HttpHeaders({ 'Authorization': 'Bearer ' +token_parsed})};
      this.indService.postDeleteExperience(value,option).subscribe(response => {
      },
      error => {
        let message = "Failed deleting work experience. Pelase try again";
        this.toastr.error(message, 'Error', {
          closeButton: true
        });
      });
    }
  }

  onFileChange(event, workExpNo, imgNo) {
    const maxSize = 15*1024*1024; // 15mb

    if(event.target.files.length > 0) {
      if(event.target.files[0].size <= maxSize){
        let file = event.target.files[0];
        
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]); // read file as data url
        reader.onload = (event:any) => { // called once readAsDataURL is completed
          (<HTMLImageElement>document.getElementById(`prevWorkImg_${workExpNo}${imgNo}`)).src = event.target.result;
          (<HTMLInputElement>document.getElementById(`workImg_${workExpNo}${imgNo}`)).setAttribute('value', btoa(event.target.result));
          (<HTMLInputElement>document.getElementById(`imgDelBtn_${workExpNo}${imgNo}`)).style.display = "block";
        }
      }else{
        (<HTMLImageElement>document.getElementById(`prevWorkImg_${workExpNo}${imgNo}`)).src = this.imageUpload;
      }
    }
  }

  deleteImage(workExpNo, imgNo){
    (<HTMLImageElement>document.getElementById(`prevWorkImg_${workExpNo}${imgNo}`)).src = this.imageUpload;
    (<HTMLInputElement>document.getElementById(`workImg_${workExpNo}${imgNo}`)).setAttribute('value', 'delete');
    (<HTMLInputElement>document.getElementById(`imgDelBtn_${workExpNo}${imgNo}`)).style.display = "none";
  }

  createRange(number){
    var items: number[] = [];
    for(var i = 1; i <= number; i++){
       items.push(i);
    }
    return items;
  }

  getImageIndex(lenght, index) {
    return lenght + index;
  }

  resetFromDateInput(index){
    const periodFrom = this.workForm.controls['experiences']['controls'][index]['controls']['periodFrom'];
    periodFrom.setValue('');
  }
  resetToDateInput(index){
    const periodTo = this.workForm.controls['experiences']['controls'][index]['controls']['periodTo'];
    periodTo.setValue('');
  }
}
