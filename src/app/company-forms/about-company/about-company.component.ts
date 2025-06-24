import { ErrorHandlerService } from './../../services/error-handler.service';

import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { IndividualService } from '../../services/individual.service';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { ToastrService } from 'ngx-toastr';
import { responsiveService } from '../../services/responsive.service';

declare var $ : any;

@Component({
  selector: 'app-about-company',
  templateUrl: './about-company.component.html',
  styleUrls: ['./about-company.component.css']
})
export class AboutCompanyComponent implements OnInit {
  form: FormGroup;
  defaultProfImg:any = "../assets/images/default_profile.png";
  defaultCoverPhoto:any = "../assets/images/default_cover.png";
  profilePicError = false;
  coverPicError = false;
  public showErrorModal = false;
  loading = false;
  public isMobile: Boolean; //responsive checker
  
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(private errorHandler:ErrorHandlerService,
    private fb: FormBuilder,
    private authService : AuthService,
    private router: Router,
    private indService : IndividualService,
    private toastr: ToastrService,
    private responsiveService: responsiveService) { 
      this.createForm();
      this.getAboutCompany();
  }

  ngOnInit() {
    //responsive checker
    this.onResize();
    this.responsiveService.checkWidth();
    
    $('.modal').modal('hide');
    $('.modal-backdrop').remove();
  }

  //responsive checker
  onResize() {
    this.responsiveService.getMobileStatus().subscribe(isMobile => {
      this.isMobile = isMobile;
    });
  }

  createForm() {
    this.form = this.fb.group({
      profile_picture: null,
      cover_photo: null,
      about: '',
      expertise: '',
    });
  }

  getAboutCompany(){
    this.loading = true;

    let token_parsed = this.authService.getToken();
    let options = {headers: new  HttpHeaders({ 'Authorization': 'Bearer ' +token_parsed})};
    this.indService.getAboutMeData(options).subscribe(response => {
      if(Object.keys(response['data']).length >0){
        if(response['data'].show_complete_now){
          $('#myModal').modal({
            show: true,
            backdrop: 'static',
          });
        }
        this.form = this.fb.group({
          about: response['data'].about,
          profile_picture: null,
          cover_photo: null,
          expertise: response['data'].expertise
        });
        if(response['data'].profile_picture !== null && response['data'].profile_picture !== ''){
          this.defaultProfImg = response['data'].profile_picture;
        }
        if(response['data'].cover_photo !== null && response['data'].cover_photo !== ''){
          this.defaultCoverPhoto = response['data'].cover_photo;
        }
      }
      this.loading = false;
    },error => {
      this.showErrorModal = this.errorHandler.errorHandleFunction(error);
      this.loading = false;
    });
  }

  onProfilePicChange(event) {
    const maxSize = 15*1024*1024; // 15mb
    if(event.target.files.length > 0){
      if(event.target.files[0].size < maxSize){
        this.profilePicError = false;
        let file = event.target.files[0];
        this.form.get('profile_picture').setValue(file);
        var reader = new FileReader();
  
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event: Event) => {
          this.defaultProfImg = reader.result;
        }
      }else{
        this.profilePicError = true;
        this.defaultProfImg = "../assets/images/upload.png";
        this.form.get('profile_picture').setValue('');
      }
    }
  }

  onCoverPicChange(event) {
    const maxSize = 15*1024*1024; // 15mb
    if(event.target.files.length > 0) {
      if(event.target.files[0].size < maxSize){
        this.coverPicError = false;
        let file = event.target.files[0];

        var reader = new FileReader();
        let image = new Image;
        reader.readAsDataURL(event.target.files[0]);
        reader.onloadend = ((loadEvent: any) => {
          image.src = loadEvent.target.result;
        });
        image.onload = (event: Event) => {
          if(image.width < 900) {
            console.log('Cover image width minimum 900px');
            this.toastr.error('Cover image width minimum 900px', 'Error', {
              closeButton: true
            });
          }
          else {
            this.form.get('cover_photo').setValue(file);
            this.defaultCoverPhoto = reader.result;
          }
        }
      }else{
        this.coverPicError = true;
        this.defaultCoverPhoto = null;
        this.form.get('cover_photo').setValue('');
      }
    }
  }

  private prepareSave(): any {
    let input = new FormData();
    input.append('profile_picture', this.form.get('profile_picture').value);
    input.append('cover_photo', this.form.get('cover_photo').value);
    input.append('about', this.form.get('about').value);
    input.append('expertise', this.form.get('expertise').value);
    return input;
  }

  onSubmit() {
    if(this.loading) return;

    this.defaultProfImg = "../assets/images/spinner.gif";
    const formModel = this.prepareSave();

    let token_parsed = this.authService.getToken();
    let options = {headers: new  HttpHeaders({ 'Authorization': 'Bearer ' +token_parsed})};
    this.indService.postAboutYourself(formModel,options).subscribe(response => {
      this.form = this.fb.group({
        profile_picture: null,
        cover_photo: null,
        about: response['data'].about,
        expertise: response['data'].about
      });
      if(response['data'].profile_picture !== null && response['data'].profile_picture !== ''){
        localStorage.setItem('profile_image', response['data'].profile_picture);
        this.defaultProfImg = response['data'].profile_picture ;
      }
      if(response['data'].cover_photo !== null && response['data'].cover_photo !== ''){
        localStorage.setItem('cover_image', response['data'].cover_photo);
        this.defaultCoverPhoto = response['data'].cover_photo ;
      }
    },error => {
      if(error.statusText == "Unathorized"){
        this.authService.tokenExpired();
      }
    }); 
  }

  clearFile() {
    this.form.get('profile_picture').setValue(null);
    this.fileInput.nativeElement.value = '';
  }
}
