import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceBackend } from '../service-backend.service';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  selectedOption: string = 'profile';
  userProfile: any={};
  newBalance:any=0;
  editMode: any = {}; // Object to track edit mode for each field
  donations: any[] = []; // Example donations data
  totalBalance: number = 1000; // Example total balance
  campaignData: any={
    cause: '',
    title: '',
    description: '',
    goal_amount: null,
    start_date: null,
    end_date: null,
    beneficiary_name: '',
    beneficiary_age: null,
    beneficiary_city: '',
    beneficiary_mobile: ''
  };
  userCampaigns:any=[];
  visibleButton:boolean=false;

  constructor(
    private router: Router,
    private serviceBackend: ServiceBackend,
    private authService: AuthService,
    private toaster:ToastrService) {}

  ngOnInit(): void {
    this.showProfile();
  }

  showProfile() {
    this.serviceBackend.getUserProfile()
      .then(userProfile => {
        console.log(userProfile);
        console.log(userProfile.userData);
        this.userProfile = userProfile.userData;
      })
      .catch(error => {
        console.error('Error fetching user profile:', error);
        if(error.response.data.message) this.toaster.error(error.response.data.message)
        else this.toaster.error(error.response.data.error)
      });
  }

  async downloadReceipt(donation: any) {
    const title = await this.serviceBackend
        .getCampaignById(donation.campaign_id)
        .then((data) => data.data.title);
        console.log(title)
 
    const receiptContent = `
    <div style="text-align: center;border:1px solid black;">
    <h1>DONATION RECIPT</h1>
    <table style="border-collapse: collapse; width: 80%; margin: auto; border: 1px solid #ddd;">
      <thead>
        <tr style="background-color: #f2f2f2;">
          <th style="padding: 8px; border: 1px solid #ddd;">ID</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Donor ID</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Donor Name</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Campaign ID</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Campaign Name</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Amount</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Transaction Date</th>
        </tr>
      </thead>
      <tbody>
        <tr style="text-align: center;border: 1px solid #ddd;">
          <td style="padding: 8px; border: 1px solid #ddd;">${donation.id}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${donation.donor_id}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${this.userProfile.name}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${donation.campaign_id}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${title}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${donation.amount}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${donation.transaction_date}</td>
        </tr>
      </tbody>
    </table>
  </div>
  
    `;

    // Convert HTML content to a Blob object
    const blob = new Blob([receiptContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt_${donation.id}.html`; // Set the filename
    link.click();

    // Release the URL object
    window.URL.revokeObjectURL(url);
    this.toaster.success("recipt downloaded successfully")
  }

  addBalance(){
    this.serviceBackend.updateUser({'balance':Number(this.userProfile.balance)+Number(this.newBalance)}).then(
      data=>{

        this.showProfile();
        this.toaster.success("Rs."+this.newBalance+" added to your account")
        this.totalBalance = this.userProfile.balance + this.newBalance;
        this.newBalance = 0;
      })

      
 
  }


  profile(){
    this.selectedOption = 'profile';
  }

  showDonations() {
    this.selectedOption = 'donations';
    this.serviceBackend.userDonationsById().then(data=>this.donations=data.data)
  }

  showBalance() {
    this.totalBalance = this.userProfile.balance;
    this.selectedOption = 'balance';
  }

  showMyCampaigns() {
    this.selectedOption = 'myCampaigns';
    this.serviceBackend.getAllCampaignBySameUserId().then(data=>{
      this.userCampaigns= data.data.campaigns;
      console.log(this.userCampaigns)
      });
  }

  visitCampaign(campid:any){
    this.router.navigate(['/details/'+campid]);
  }

  toggleEditMode(field: string) {
    this.editMode[field] = !this.editMode[field];
  }

  saveChanges(field: string) {
    // Implement save changes logic here
    this.serviceBackend.updateUser({"name":this.userProfile.name}).then(()=>{
      this.toaster.success("name updated successfully")
    }).catch((error)=>{
      if(error.response.data.message) this.toaster.error(error.response.data.message)
        else this.toaster.error(error.response.data.error)
    })

    this.toggleEditMode(field);

    
  }

  deleteCampaign(campId:any){
    
    this.serviceBackend.deleteCampaign(campId).then(()=>{
      this.toaster.success("campaign deleted successfully")
    }).catch((error)=>{
      if(error.response.data.message) this.toaster.error(error.response.data.message)
        else this.toaster.error(error.response.data.error)
    })
    this.showMyCampaigns()
    
  }


  cancelEdit(field: string) {
    // Implement cancel edit logic here
    this.toggleEditMode(field);
  }

  CreateCampaign() {
    this.selectedOption = 'CreateCampaign';
  }

  createCampaignEntry() {
    // Add logic to handle form submission and campaign creation
    console.log('Campaign created with data:', this.campaignData);

    let data = this.serviceBackend.createCampaign(this.campaignData).then(()=>{
      this.toaster.success("campaign created successfully")
      this.showMyCampaigns(); 
      this.resetForm();
    }).catch((error)=>{
      if(error.response.data.message) this.toaster.error(error.response.data.message)
        else this.toaster.error(error.response.data.error)
    })
    


    // Reset the form after submission

    // Switch back to the default view after campaign creation
  // Change to whichever default view you prefer
  }

  cancelCreateCampaign() {
    // Reset the form and switch back to the default view
    this.resetForm();
    this.showBalance(); // Change to whichever default view you prefer
  }

  deactivateCampaign(campId:any){
    this.serviceBackend.deactivateCampaign(campId).then(data=>{
      this.showMyCampaigns();
    }).then(()=>{
      this.toaster.success("campaign deactivated successfully")
    }).catch((error)=>{
      if(error.response.data.message) this.toaster.error(error.response.data.message)
        else this.toaster.error(error.response.data.error)
    })
  }

  activateCampaign(campId:any){

    this.serviceBackend.activateCampaign(campId).then(data=>{
      this.showMyCampaigns();
    }).then(()=>{
      this.toaster.success("campaign activated successfully")
    }).catch((error)=>{
      if(error.response.data.message) this.toaster.error(error.response.data.message)
        else this.toaster.error(error.response.data.error)
    })
  }

  resetForm() {
    // Reset campaign data
    this.campaignData = {
      cause: '',
      title: '',
      description: '',
      goalAmount: null,
      startDate: null,
      endDate: null,
      beneficiaryName: '',
      beneficiaryAge: null,
      beneficiaryCity: '',
      beneficiaryMobile: ''
    };
  }


  logout() {
    this.authService.logout();
    this.toaster.success("User Logged out")
    this.router.navigate(['/login']); // Redirect to the login page after logout
  }




  showPanForm = false;
  panNumber: string = '';

  submitPan(){
    // Save PAN number logic
    this.serviceBackend.updateUser({
      "role":"fundraiser",
      "pan":this.panNumber
    }).then(()=>{
      this.toaster.success("user updated to Fundraiser")
      this.showProfile()
    }).catch((error)=>{
     
      this.toaster.error(error.response.data.errors["pan"][0])
    })

    
    
    this.closePanForm();
  }

  closePanForm() {
    this.showPanForm = false;
    this.panNumber = ''; // Clear PAN number input
  }

  toggleDescription(campaign: any) {
    campaign.showFullDescription = !campaign.showFullDescription;
}


}
