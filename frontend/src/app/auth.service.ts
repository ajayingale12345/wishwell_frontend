import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_TOKEN_KEY = 'loginToken';
  private token = '';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Retrieve token from localStorage during initialization
    if (isPlatformBrowser(this.platformId)) {
      const storedToken = localStorage.getItem(this.AUTH_TOKEN_KEY);
      if (storedToken) {
        this.token = storedToken;
        this.isLoggedInSubject.next(true); // Emit that user is logged in
      }
    }
  }

  setAuthToken(token: string): void {
    this.token = token;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.AUTH_TOKEN_KEY, token); // Store token in localStorage
    }
    this.isLoggedInSubject.next(true); // Emit that user is logged in
  }

  getAuthToken(): string {
    return this.token;
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  logout(): void {
    this.token = '';
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.AUTH_TOKEN_KEY); // Remove token from localStorage
    }
    this.isLoggedInSubject.next(false); // Emit that user is logged out
  }
}
