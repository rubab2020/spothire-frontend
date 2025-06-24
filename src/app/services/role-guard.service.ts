import { Injectable } from '@angular/core';
import { 
  Router,
  CanActivate,
  ActivatedRouteSnapshot
} from '@angular/router';
import { AuthService } from './auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class RoleGuardService implements CanActivate {
  constructor(public authService: AuthService, public router: Router) {}
  canActivate(route: ActivatedRouteSnapshot): boolean {
    // this will be passed from the route config
    // on the data property
    const expectedRole = route.data.expectedRole;
    const token = localStorage.getItem('token');

    // decode the token to get its payload
    if(!token) {
      this.router.navigate(['/register']);
      return false;
    }

    const jwtHelper = new JwtHelperService();
    const decodedToken = jwtHelper.decodeToken(token);

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/register']);
      return false;
    }else if(decodedToken.user_type !== expectedRole){
      this.router.navigate(['hire-or-serve']);
      return false;
    }else{
      return true;
    }
  }
}