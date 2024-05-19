import { Component, NgModule, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ServiceBackend } from "../service-backend.service";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: "app-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.css"],
})
export class DetailsComponent implements OnInit {
  campaignId: string = "";
  campaign: any = {};
  donationAmount: number = 50;
  donations: any = [];
  showDonationForm: boolean = false; 
  percent:number =0;


  constructor(
    private route: ActivatedRoute,
    private serviceBackend: ServiceBackend,
    private toastr: ToastrService
  ) {
    // console.log(toast);


  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.campaignId = params["id"];
      this.serviceBackend
        .getAllCampaignDonations(this.campaignId)
        .then((data) => (this.donations = data.data.reverse()));
      this.campaign = this.serviceBackend
        .getCampaignById(this.campaignId)
        .then((data) => {
          this.campaign = data.data;
          this.showDonationForm = this.campaign.goal_amount > this.campaign.current_amount;
          console.log(data.data);
          this.percentage()
        });
    });
  }

  getval(){
    return Number(this.campaign.goal_amount) >=  Number(this.campaign.current_amount)
  }

  percentage(){
    this.percent = Math.ceil((this.campaign.current_amount /this.campaign.goal_amount)*100) 
  }

  donate(): void {

    if(this.donationAmount <= 0) {
      this.toastr.error("please enter valid amount "); 
    } else{
      this.serviceBackend.getUser().then((data) => {

        if (this.donationAmount > data.data.balance) {
          this.toastr.error("insufficient Balance Recharge your wallet "); 
        }else{
          this.serviceBackend
            .updateUser({ balance: data.data.balance - this.donationAmount })
            .then((data) => console.log(data));
  
          this.serviceBackend
            .updateCampaignCurrentAmount({
              current_amount_add: this.donationAmount,
              id: this.campaignId,
            })
            .then((data) => (this.campaign = data.data));
          console.log(data.data);
          
          this.serviceBackend
            .createDonationEntry({
              donor_id: data.data.id,
              campaign_id: this.campaignId,
              amount: this.donationAmount,
            })
            .then((data) => {
              this.serviceBackend
                .getAllCampaignDonations(this.campaignId)
                .then((data) => (this.donations = data.data.reverse()));
                this.campaign = this.serviceBackend
          .getCampaignById(this.campaignId)
          .then((data) => {
            this.campaign = data.data;
            this.showDonationForm = this.campaign.goal_amount > this.campaign.current_amount;
            console.log(data.data);
          });
            });
            this.toastr.success("Thank you for your donation of Rs. "+this.donationAmount);     
        }
  
      });
    }





  }


  calculateProgress(): number {
    return (this.campaign.current_amount / this.campaign.goal_amount) * 100;
  }

}
