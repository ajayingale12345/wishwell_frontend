import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnDestroy {
  isLoggedIn: boolean = false;
  private authSubscription: Subscription;

  constructor(private authService: AuthService) {
    this.isLoggedIn = this.authService.isLoggedIn(); // Initialize isLoggedIn based on current auth status
    this.authSubscription = this.authService.isLoggedIn$.subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn; // Update isLoggedIn when auth status changes
    });
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
