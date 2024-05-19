// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true; // Allow navigation to the route if user is logged in
    } else {
      this.router.navigate(['/login']); // Redirect to login page if user is not logged in
      return false; // Prevent navigation to the route
    }
  }
}
