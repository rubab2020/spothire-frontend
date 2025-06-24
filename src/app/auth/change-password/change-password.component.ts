import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { responsiveService } from "../../services/responsive.service";
import * as $ from "jquery";
declare var $ : any;

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  public circleSpin = false;
  public userData:any;
  public token:any;
  public image_name:any;
  public changePw: FormGroup;
  public isMobile: Boolean; //responsive checker
  netImage: any = "../assets/images/monika.jpg";

  constructor(
    private responsiveService: responsiveService,
    private _fb: FormBuilder, 
    public service:AuthService, 
    private toastr: ToastrService
  ) { 
    const jwtHelper = new JwtHelperService();
    this.token = this.service.getToken();
    this.userData = jwtHelper.decodeToken(this.token);
    this.image_name = service.getImage;
  }

  ngOnInit() {
    this.changePw = this._fb.group({
      current_password:['', [Validators.required]],
      new_password:['', [Validators.required, Validators.minLength(8), , Validators.pattern(/(?=\D*\d)(?=[^a-z]*[a-z])/) ]],
      confirm_password:['', [Validators.required, this.passwordMatcher.bind(this)]]
    });

    //responsive checker
    this.onResize();
    this.responsiveService.checkWidth();
  }

  //responsive checker
  onResize() {
    this.responsiveService.getMobileStatus().subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }

  // confirm new password validator
  private passwordMatcher(control: FormControl): { [s: string]: boolean } {
    if (
        this.changePw &&
        (control.value !== this.changePw.controls.new_password.value)
    ) {
        return { passwordNotMatch: true };
    }
    return null;
  }

  changePassword(value){
    this.circleSpin = true;

    this.changePw.controls['current_password'].markAsTouched()
    this.changePw.controls['new_password'].markAsTouched()
    this.changePw.controls['confirm_password'].markAsTouched()

    if(this.changePw.valid){
      let token_parsed = this.service.getToken();
      let options = {headers: new  HttpHeaders({ 'Authorization': 'Bearer ' +token_parsed})};
      
      this.service.resetPassword(value,options).subscribe(response => {
        this.changePw.reset();
        this.toastr.success('Password has been changed!', 'Success!',{
          closeButton: true
        });
        this.circleSpin = false;
      },error => {
        this.circleSpin = false;
        if(error.status == 401 && error.statusText == "Unauthorized"){
          this.service.tokenExpired();
        }
  
        let data = error.error.error.message;
  
        Object.keys(data).forEach((fieldName) => {
            this.changePw.controls[fieldName].setErrors({backend: data[fieldName]});
        });
      });
    }
  }

  openNav() {
    var x = window.matchMedia("(max-width: 1280px)")
    if (x.matches) { 
      document.getElementById("mySidenav").style.width = "280px";
    }
    else{
      document.getElementById("mySidenav").style.width = "340px";
    }
    $('#overlay').fadeToggle( "slow", "swing" );
  }

  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    $('#overlay').fadeOut('slow');
  }
}
