import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable()
export class AnonymousGuardService {
  private INDV_NAME = environment.individualName;
  private COMP_NAME = environment.companyName;

  constructor(private authService:AuthService, private router:Router) { }

  canActivate(){
    if(!this.authService.isLoggedIn()) return true;

    //social-auth redirect code
    if(this.authService.hasCompleteNow()){
      if(this.authService.getUserType() == this.INDV_NAME){
        this.router.navigate(["individual/about-yourself"]);
      }else{
        this.router.navigate(["company/introduction"]);
      }
      return false;
    }

    localStorage.removeItem('show_complete_now');
    
    this.router.navigate(['/hire-or-serve']);
    return false;
  }

}
