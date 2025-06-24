import { ErrorHandlerService } from './../../services/error-handler.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { IndividualService } from '../../services/individual.service';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms"
import * as $ from "jquery";
declare var $ : any;
import { ToastrService } from 'ngx-toastr';
import { responsiveService } from '../../services/responsive.service';

@Component({
  selector: 'app-about-yourself',
  templateUrl: './about-yourself.component.html',
  styleUrls: ['./about-yourself.component.css']
})

export class AboutYourselfComponent implements OnInit {
  title = 'app';
  form: FormGroup;
  defaultProfImg:any = "../assets/images/default_profile.png";
  defaultCoverPhoto:any = "../assets/images/default_cover.png";
  imageError = false;
  public showErrorModal = false;
  selectedSkills = [];
  tags = [{}];
  profilePicError = false;
  coverPicError = false;
  loading = false;
  hasCustomTagTypeError = false;
  public isMobile: Boolean; //responsive checker
  
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(private errorHandler:ErrorHandlerService,
    private fb: FormBuilder,
    private authService : AuthService,
    private router: Router,
    private individualService : IndividualService,
    private toastr: ToastrService,
    private responsiveService: responsiveService) { 
      this.createForm();
      this.getAboutYourself();
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
      dob: '',
      gender: '',
      about_yourself: '',
      skills: [[]]
    });
  }

  getAboutYourself(){
    this.loading = true;

    let token_parsed = this.authService.getToken();  
    let options = {headers: new  HttpHeaders({ 'Authorization': 'Bearer ' +token_parsed})};
    this.individualService.getAboutMeData(options).subscribe(response => {
      if(Object.keys(response['data']).length >0){
        if(Object.keys(response['data']['skills']).length > 0){
          response['data']['skills'].forEach((skill,index) => {
            this.selectedSkills.push(skill.name)
          });
        };

        this.form = this.fb.group({
          about_yourself: response['data'].about,
          profile_picture: null,
          cover_photo: null,
          dob: response['data'].dob,
          gender: response['data'].gender,
          skills: [this.selectedSkills]
        });

        if(response['data'].profile_picture !== null && response['data'].profile_picture !== ''){
          this.defaultProfImg = response['data'].profile_picture;
        }
        if(response['data'].cover_photo !== null && response['data'].cover_photo !== ''){
          this.defaultCoverPhoto = response['data'].cover_photo;
        }
      }
      this.tags = response['tags'];
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
    let dob = '';
    if(this.form.get('dob').value && this.form.get('dob').value !== "" && this.form.get('dob').value !== null){
      const date = new Date(this.form.get('dob').value);
      dob = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
    }

    const input = new FormData();
    input.append('profile_picture', this.form.get('profile_picture').value);
    input.append('cover_photo', this.form.get('cover_photo').value);
    input.append('about_yourself', this.form.get('about_yourself').value);
    input.append('dob', dob);
    input.append('gender', this.form.get('gender').value);
    input.append('skills', this.form.get('skills').value);

    return input;
  }

  onSubmit() {
    if(this.loading) return;
    
    this.defaultProfImg = "../assets/images/spinner.gif";
    const formModel = this.prepareSave();

    let token_parsed = this.authService.getToken();
    let options = {headers: new  HttpHeaders({ 'Authorization': 'Bearer ' +token_parsed})};

    this.individualService.postAboutYourself(formModel,options).subscribe(response => {
      this.form = this.fb.group({
        about_yourself: response['data'].about,
        avatar: null
      });
      if(response['data'].profile_picture !== null && response['data'].profile_picture !== '')
      {
        localStorage.setItem('profile_image', response['data'].profile_picture);
        this.defaultProfImg = response['data'].profile_picture ;
      }
    },error => {
      if(error.statusText == "Unathorized"){
        this.authService.tokenExpired();
      }
    });
  }

  clearFile() {
    this.form.get('avatar').setValue(null);
    this.fileInput.nativeElement.value = '';
  }

  resetDateInput(){
    this.form.get('dob').setValue('');
  }

  addTagFn = (term) => {
    const maxLength = 15;
      if (term.length <= maxLength) {
        this.hasCustomTagTypeError = false;
        return term;
      }
      else{
        this.hasCustomTagTypeError = true;
        return null;
      }
  }
}
