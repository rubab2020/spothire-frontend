import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import {RequestOptions} from '@angular/http';
import { environment } from '../../environments/environment';
@Injectable()
export class IndividualService {
  private API_URL = environment.apiUrl;

  private profileUrl = `${this.API_URL}/api/profile`;
  
  private about_url = `${this.API_URL}/api/about-yourself`;
  private saveAbout_url = `${this.API_URL}/api/about-yourself/save`;

  private getAboutQualification_url = `${this.API_URL}/api/qualifications`;
  private saveAboutQualification_url = `${this.API_URL}/api/qualifications/save`;
  private deleteQualificationaUrl = `${this.API_URL}/api/qualification/delete`;

  private getAboutExperience_url = `${this.API_URL}/api/experiences`;
  private saveAboutExperience_url = `${this.API_URL}/api/experiences/save`;
  private deleteWorkUrl = `${this.API_URL}/api/experience/delete`;

  private getAwardsUrl = `${this.API_URL}/api/awards`;
  private postAwardsUrl = `${this.API_URL}/api/awards/save`;
  private deleteAwardUrl = `${this.API_URL}/api/award/delete`;
  
  private getSkillsUrl = `${this.API_URL}/api/skills`;
  private PostSkillsUrl = `${this.API_URL}/api/skills/save`;

  private getIndvSettingsUrl = `${this.API_URL}/api/settings/individual`;
  private saveIndvSettingsUrl = `${this.API_URL}/api/settings/individual/update`;

  constructor(private http:HttpClient) { }

  getAboutMeData(options){
    return this.http.get(this.about_url,options);
  }

  getWorkerProfile(options){
    return this.http.get(this.profileUrl,options);
  }

  // about yourself
  postAboutYourself(value,options){
    return this.http.post(this.saveAbout_url,value,options);
  }

  // qualification
  postQualifications(value,options){
    return this.http.post(this.saveAboutQualification_url,value,options);
  }
  getQualifications(options){
    return this.http.get(this.getAboutQualification_url,options);
  }
  postDeleteQualification(value,options){
    return this.http.post(this.deleteQualificationaUrl,value,options);
  }

  // work experience
  getWorkExperience(options){
    return this.http.get(this.getAboutExperience_url,options);
  }
  postWorkExperience(value,options){
    return this.http.post(this.saveAboutExperience_url,value,options);
  }
  postDeleteExperience(value,options){
    return this.http.post(this.deleteWorkUrl,value,options);
  }

  // awards
  getAwards(options){
    return this.http.get(this.getAwardsUrl, options);
  }
  postAwards(value,options){
    return this.http.post(this.postAwardsUrl,value,options);
  }
  postDeleteAward(value,options){
    return this.http.post(this.deleteAwardUrl,value,options);
  }

  // skills
  getAllSkillsData(options){
    return this.http.get(this.getSkillsUrl,options);
  }
  PostAllSkillsData(value,options){
    return this.http.post(this.PostSkillsUrl,value,options);
  }

  // individual settings
  getIndividualSettingsData(options){
    return this.http.get(this.getIndvSettingsUrl,options);
  }
  postIndividualSettingsData(value,options){
    return this.http.post(this.saveIndvSettingsUrl,value,options);
  }
}
