import { Component, OnInit } from '@angular/core';
import { ServiceBackend } from '../service-backend.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  campaigns: any = [];
  filteredCampaigns: any = [];
  searchQuery: string = '';

  constructor(
    private serviceBackend: ServiceBackend,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getCampaigns();
  }

  getCampaigns() {
    this.serviceBackend.getAllActiveCampaigns()
      .then(data => {
        this.campaigns = data.data;
        this.filteredCampaigns = [...this.campaigns]; // Initialize filteredCampaigns with all campaigns
      })
      .catch(error => {
        console.error('Error fetching campaigns:', error);
      });
  }

  goToDetailsPage(id: string) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/details/' + id]);
    } else {
      this.router.navigate(['/login']);
    }
  }

  filterCampaigns() {
    this.filteredCampaigns = this.campaigns.filter((campaign: { title: string; }) =>
      campaign.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  clearSearch() {
    this.searchQuery = '';
    this.filterCampaigns(); // Reset filteredCampaigns
  }

  calculateProgress(campaign: any): number {
    return (campaign.current_amount / campaign.goal_amount) * 100;
  }
  
}