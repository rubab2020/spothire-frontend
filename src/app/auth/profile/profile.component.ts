import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../../services/auth.service';
import { environment } from "../../../environments/environment";
import { IndividualService } from '../../services/individual.service';
import { HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public INDV_NAME = environment.individualName;
  public COMP_NAME = environment.companyName;

  public user: any;
  public token: any;

  previewLoading = false;
  public profile = null;

  constructor(
    public authService: AuthService,
    private indService: IndividualService,
    private toastr: ToastrService,
    private compService: CompanyService,
  ) {
    this.getUser(authService);

    this.getProfile();
  }

  ngOnInit() {
  }

  private getUser(authService: AuthService) {
    const jwtHelper = new JwtHelperService();
    this.token = this.authService.getToken();
    this.user = jwtHelper.decodeToken(this.token);
    this.user['name'] = localStorage.getItem('name');
    this.user['email'] = localStorage.getItem('email');
    this.user["profile_picture"] = authService.getImage();
  }

  getEditFormPageLink() {
    return this.user.user_type == this.INDV_NAME
      ? "/individual/about-yourself"
      : "/company/introduction";
  }

  getProfile(){
    this.previewLoading = true;

    let token_parsed = this.authService.getToken();
    let options = {headers: new  HttpHeaders({ 'Authorization': 'Bearer ' +token_parsed})};
    if(this.user.user_type  == this.INDV_NAME) {
      this.indService.getWorkerProfile(options).subscribe(response => {
        this.profile = response['data'];
        this.previewLoading = false;
      },error => {
        if(error.status == 400){
          this.toastr.error(error.error.error.message, 'Error', {
            closeButton: true
          });
        }
        if(error.status == 401 && error.statusText == "Unauthorized"){
          this.authService.tokenExpired();
        }
        this.previewLoading = false;
      });
    }
    else {
      let token_parsed = this.authService.getToken();
      let options = {headers: new  HttpHeaders({ 'Authorization': 'Bearer ' +token_parsed})};
      this.compService.getEmployerProfile(options).subscribe(response => {
        this.profile = response['data']; 
        this.previewLoading = false;
      },error => {
        if(error.status == 400){
          this.toastr.error(error.error.error.message, 'Error', {
            closeButton: true
          });
        }
        if(error.status == 401 && error.statusText == "Unauthorized"){
          this.authService.tokenExpired();
        }
        this.previewLoading = false;
      });
    }
  }

  getLogoCoverSectionClass() {
    return "logo-cover-section-with-phn";
  }

}
