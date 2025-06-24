import { ErrorHandlerService } from './../../services/error-handler.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { CompanyService } from '../../services/company.service';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { SwiperComponent, SwiperDirective, SwiperConfigInterface,
  SwiperScrollbarInterface, SwiperPaginationInterface } from 'ngx-swiper-wrapper';
import { ToastrService } from 'ngx-toastr';
import { responsiveService } from '../../services/responsive.service';
import { environment } from "../../../environments/environment";
import * as $ from "jquery";
import { Router } from '@angular/router';
declare var $ : any;

@Component({
  selector: 'app-company-value',
  templateUrl: './company-value.component.html',
  styleUrls: ['./company-value.component.css']
})
export class CompanyValueComponent implements OnInit {
  private MAX_IMAGE_UPLOAD = environment.maxImageUpload;

  imageUpload:any = "../assets/images/upload.png";
  defaultCoverPhoto:any = "../assets/images/default_cover.png";
  defaultProfImg:any = "../assets/images/default_profile.png";

  compValueForm: FormGroup;
  public showErrorModal = false;
  companyProfile = null;
  loading = false;
  previewLoading = false;
  public isMobile: Boolean; //responsive checker

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
    private fb: FormBuilder,
    private compService: CompanyService,
    private authService: AuthService,
    private router: Router,
  ){
      this.createForm();
      this.getCompanyValue();
  }

  ngOnInit() {
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

  createForm() {
    this.compValueForm = this.fb.group({
      total_employees: null,
      images: this.fb.array([])
    });
  }

  getCompanyValue(){
    this.loading = true;

    let token_parsed = this.authService.getToken();
    let options = {headers: new  HttpHeaders({ 'Authorization': 'Bearer ' +token_parsed})};

    this.compService.getCompanyValueData(options).subscribe(response => {
      this.compValueForm = this.fb.group({
        total_employees: response['data'].total_employees,
        images: response['data'].images.length > 0 
                ? this.fb.array(response['data'].images)
                : this.fb.array([])
      });

      this.loading = false;
      
      if(this.MAX_IMAGE_UPLOAD == 1)
        this.config.pagination = false;
    },error => {
      this.showErrorModal = this.errorHandler.errorHandleFunction(error);
      this.loading = false;
    });
  }

  onSubmit(values:any, actionType:any){
    if(!this.loading){
      let allImages = [];

      // create 4 images fileds for work images
      for(let i = 0; i < this.MAX_IMAGE_UPLOAD; i++) {
        if(typeof values.images[i] === 'undefined'){
          values.images.push({id: null, image: null});
        }
      }
      for(let imgCnt = 0; imgCnt < this.MAX_IMAGE_UPLOAD; imgCnt++){
        let img = (<HTMLInputElement>document.getElementById(`img_${imgCnt}`)).getAttribute('value');
        if(img == 'delete'){
          values.images[imgCnt].image = 'delete';
        }
        else{
          if(img) {
            values.images[imgCnt].image = 'save_image';
            allImages.push((<HTMLInputElement>document.getElementById(`img_${imgCnt}`)).files[0]);
          }
          else  
            values.images[imgCnt].image = null;
        }
  
        let desc = ((document.getElementById(`description_${imgCnt}`) as HTMLInputElement).value);
        values.images[imgCnt].description = desc;
      }

      const formData = new FormData();
      formData.append('data', JSON.stringify(values));
      allImages.forEach(file => formData.append('images[]', file));

      let token_parsed = this.authService.getToken();
      let option = {headers: new  HttpHeaders({ 'Authorization': 'Bearer ' +token_parsed})};
      
      this.compService.PostCompanyBackgroundBenefit(formData, option).subscribe(response => {
        const data = response['data'];
        this.compValueForm = this.fb.group({
          total_employees: data.total_employees,
          images: data.images.length > 0 
                  ? this.fb.array(data.images)
                  : this.fb.array([])
        });
      });
    }
    
    if(actionType == 'finish-profile'){
      this.router.navigate(["hire-or-serve"]);
    }
  }

  noImages(items){
    let count = 0;
    for(let item of items){
      if(item.image == null) count ++;
    }
    return count == items.length ? true : false
  }

  onFileChange(event, imgNo) {
    const maxSize = 15*1024*1024; // 15mb
    
    if(event.target.files.length > 0) {
      if(event.target.files[0].size <= maxSize){
        let file = event.target.files[0];
        
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]); // read file as data url
        reader.onload = (event:any) => { // called once readAsDataURL is completed
          (<HTMLImageElement>document.getElementById(`prevImg_${imgNo}`)).src = event.target.result;
          (<HTMLInputElement>document.getElementById(`img_${imgNo}`)).setAttribute('value', btoa(event.target.result));
          (<HTMLInputElement>document.getElementById(`imgDelBtn_${imgNo}`)).style.display = "block";
        }
      }else{
        (<HTMLImageElement>document.getElementById(`prevImg_${imgNo}`)).src = this.imageUpload;
      }
    }
  }

  deleteImage(index){
    (<HTMLImageElement>document.getElementById(`prevImg_${index}`)).src = this.imageUpload;
    (<HTMLInputElement>document.getElementById(`img_${index}`)).setAttribute('value', 'delete');
    (<HTMLInputElement>document.getElementById(`imgDelBtn_${index}`)).style.display = "none";
  }

  createRange(number){
    var items: number[] = [];
    for(var i = 1; i <= number; i++){
       items.push(i);
    }
    return items;
  }

  imageIndex(lenght, index) {
    return lenght + index;
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
}
