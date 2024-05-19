import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardLoginRegister implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      // User is logged in, redirect to main component
      this.router.navigate(['/main']);
      return false; // Return false to prevent access to login/register component
    } else {
      return true; // Allow access to login/register component for non-logged in users
    }
  }
}
