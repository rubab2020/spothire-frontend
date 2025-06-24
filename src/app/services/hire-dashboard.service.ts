import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class HireDashboardService {
  private API_URL = environment.apiUrl;

  private hireAppliedUrl = `${this.API_URL}/api/hire/jobs/applied`;
  private hireAssignedUrl = `${this.API_URL}/api/hire/jobs/assigned`;

  private shortListApplicantUrl = `${this.API_URL}/api/short-list-applicant`;
  private interviewApplicantUrl = `${this.API_URL}/api/interview-applicant`;
  private assignApplicantUrl = `${this.API_URL}/api/assign-applicant`;
  private declineApplicantUrl = `${this.API_URL}/api/decline-applicant`;
  private deleteJobUrl = `${this.API_URL}/api/job/delete`;
  private rateJobUrl = `${this.API_URL}/api/rating/rate`;
  private discontinueApplicantUrl = `${this.API_URL}/api/hire/job/discontinue`;
  private completeJobUrl = `${this.API_URL}/api/hire/job/complete`;

  // private workerPorfileDataUrl = `${this.API_URL}/api/worker-profile`;
  // private getAppliedProfiles = `${this.API_URL}/api/hire/jobs/applied/profiles`;
  // private getAssignedProfiles = `${this.API_URL}/api/hire/jobs/assigned/profiles`;

  private getMessagesDataUrl  = `${this.API_URL}/api/messages`;
  private sentMessageToServerUrl  = `${this.API_URL}/api/messages`;
  private seenMessagesUrl  = `${this.API_URL}/api/messages/save-seen`;
  
  private paymentUrl  = `${this.API_URL}/api/payment/complete`;

  constructor(private http:HttpClient) { }

  getHireAppliedData(value,options){
    return this.http.post(this.hireAppliedUrl,value,options);
  }
  getHireAssignedData(value,options){
    return this.http.post(this.hireAssignedUrl,value,options);
  }

  // getAppliedProfilesData(value, options){
  //   return this.http.post(this.getAppliedProfiles,value,options);    
  // }
  // getAssignedProfilesData(value, options){
  //   return this.http.post(this.getAssignedProfiles,value,options);    
  // }

  shortlistApplication(value,options){
    return this.http.post(this.shortListApplicantUrl,value,options);
  }
  interviewApplicant(value,options){
    return this.http.post(this.interviewApplicantUrl,value,options);
  }
  assignApplicant(value,options){
    return this.http.post(this.assignApplicantUrl,value,options);
  }
  declineApplicant(value,options){
    return this.http.post(this.declineApplicantUrl,value,options);
  }
  deletejob(value,options){
    return this.http.post(this.deleteJobUrl,value,options);
  }
  rateJob(value,options){
    return this.http.post(this.rateJobUrl,value,options);
  }
  discontinueApplicant(value,options){
    return this.http.post(this.discontinueApplicantUrl,value,options);
  }
  completeJob(value,options){
    return this.http.post(this.completeJobUrl,value,options);
  }
  
  
  // getWorkerPorfileData(value,options){
  //   return this.http.post(this.workerPorfileDataUrl,value,options);
  // }
  
  makePayment(value,options){
    return this.http.post(this.paymentUrl,value,options);
  }

  seenMessages(value, options){
    return this.http.post(this.seenMessagesUrl,value,options);  
  }
  sentMessageToServer(value,options){
    return this.http.post(this.sentMessageToServerUrl,value,options);
  }
  getMessageData(value,options){
    let url = this.getMessagesDataUrl+'/'+value;
    return this.http.get(url,options);
  }

  getPaginatedApplicants(url, options, $jobId){
    return this.http.get(url,options);
  }
}
