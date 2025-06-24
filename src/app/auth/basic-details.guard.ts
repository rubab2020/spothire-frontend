import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service';

@Injectable()
export class BasicDetailsGuard implements CanActivate {
  constructor(public authService: AuthService, public router: Router) {}
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/register']);
      return false;
    }

    const name = localStorage.getItem('name');

    if(name.length > 0){
      this.router.navigate(['hire-or-serve']);
      return false;

    }
    return true;
  }
}
