import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import {RequestOptions} from '@angular/http';
import { environment } from '../../environments/environment';
@Injectable()
export class CompanyService {
  private API_URL = environment.apiUrl;

  // needs to be deprecated while working in profile page
  private post_about_url = `${this.API_URL}/api/about-yourself/update`;
  private update_company_background_url = `${this.API_URL}/api/company-background/update`;

  private get_company_background_url = `${this.API_URL}/api/company-background`;
  private save_company_background_url = `${this.API_URL}/api/company-background/save`;  

  private get_company_value_url = `${this.API_URL}/api/company-value`;
  private save_company_value_url = `${this.API_URL}/api/company-value/save`;
  
  private getCompanySettingsUrl = `${this.API_URL}/api/settings/company`;
  private saveCompanySettingsUrl = `${this.API_URL}/api/settings/company/update`;
  // private settings_data_url = `${this.API_URL}/api/user-settings`;

  private profile_data_url = `${this.API_URL}/api/company-profile`;
  private get_company_profile = `${this.API_URL}/api/company-profile`;

  private profileUrl = `${this.API_URL}/api/profile`;

  constructor(private http:HttpClient) { }

  postAboutYourselfData(value,options){
    return this.http.post(this.post_about_url,value,options);
  }
  
  // company background
  getCompanyBackgroundData(options){
    return this.http.get(this.get_company_background_url,options);
  }
  postCompanyBackgroundData(value,options){
    return this.http.post(this.save_company_background_url,value,options);
  }
  postCompanyBackgoundData(value,options){
    return this.http.post(this.update_company_background_url,value,options);
  }

  // company value
  getCompanyValueData(options){
    return this.http.get(this.get_company_value_url,options);
  }
  PostCompanyBackgroundBenefit(value,options){
    return this.http.post(this.save_company_value_url,value,options);
  }

  // compnay settings
  getCompanySettingsData(options){
    return this.http.get(this.getCompanySettingsUrl,options);
  }
  postCompanySettingsData(value,options){
    return this.http.post(this.saveCompanySettingsUrl,value,options);
  }

  // company profile 
  getCompanyProfileData(options){
    return this.http.get(this.profile_data_url,options);
  }
  getCompanyProfileDataWithId(options,id){
    return this.http.get(this.get_company_profile+'/'+id,options);
  }

  getEmployerProfile(options){
    return this.http.get(this.profileUrl,options);
  }
}
