import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class ErrorHandlerService {

  constructor(private authService: AuthService) { }

  errorHandleFunction(error){
    
    if(error.status == 401 && error.statusText == "Unauthorized"){
      this.authService.tokenExpired();
    }
    if(error.status == 0){
      return true;
    }
    if(error.status > 500){
      return true;
    }
  }
}
