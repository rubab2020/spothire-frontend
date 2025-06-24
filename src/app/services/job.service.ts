import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthService } from './auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class JobService {
  jobDoc: AngularFirestoreDocument<Object>;

  private API_URL     = environment.apiUrl;
  private jobsUrl     = `${this.API_URL}/api/jobs`;
  private filterWithCounts = `${this.API_URL}/api/jobs/get-counts-on-filters`;
  private jobApplyUrl = `${this.API_URL}/api/work/job/apply`;
  private profileUrl = `${this.API_URL}/api/profile`;
  private jobDeleteUrl = `${this.API_URL}/api/job/delete`;
  // private saveAbout_url = 'http://192.168.100.70/SpotHireBackend/public/api/SaveAboutYourself';
  
  // public
  private publicJobsUrl = `${this.API_URL}/api/public/jobs`;
  private publicProfileUrl = `${this.API_URL}/api/public/profile`;

  public user: any;
  public token: any;

  constructor(
    private http:HttpClient,
    private afs: AngularFirestore,
    private authService: AuthService
  ) {
    if(authService.isLoggedIn()){
      const jwtHelper = new JwtHelperService();
      this.token = authService.getToken();
      this.user = jwtHelper.decodeToken(this.token);
      this.user.id = authService.getId();
    }
  }

  getJobs(value,options){
    return this.http.post(this.jobsUrl,value,options);
  }
  getPaginateJobsData(url,options){
    return this.http.get(url,options);
  }
  getProfile(id, query, options){
    return this.http.get(this.profileUrl+'/'+id+query,options);
  }
  postApplyJob(value,options){
    return this.http.post(this.jobApplyUrl,value,options);
  }
  postDeleteJob(value,options){
    return this.http.post(this.jobDeleteUrl,value,options);
  }

  // public
  getPublicJobs(value){
    return this.http.post(this.publicJobsUrl,value);
  }
  getPublicPaginateJobsData(url){
    return this.http.get(url);
  }
  getPublicProfile(id, query){
    return this.http.get(this.publicProfileUrl+'/'+id+query);
  }

  getJobsSeen() {
    let uid = this.user ? this.user.id : null;
    this.jobDoc = this.afs.doc(`jobsSeen/${uid}`)
    return this.jobDoc.valueChanges();
  }

  markAsSeen(jobId) {
    let uid = this.user ? this.user.id : null;
    const jobs = { [jobId]: true };
    const jobsSeenPath = `jobsSeen/${uid}`;

    return this.afs.doc(jobsSeenPath).set({jobs}, {merge: true});
  }
}
