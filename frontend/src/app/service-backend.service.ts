import axios from 'axios';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceBackend {
  baseUrl = 'http://127.0.0.1:8000/api/';

  constructor(private authService: AuthService) {}

  get(url: string) {
    return axios.get(this.baseUrl + url);
  }

  registerPost(data: any) {
    return axios.post(this.baseUrl + 'register', data);
  }

  loginPost(data: any) {
    return axios.post(this.baseUrl + 'login', data);
  }

  getUserData() {
    return axios.get(this.baseUrl + 'login');
  }

  getUserProfile(){
    if (this.authService.isLoggedIn()) {
      const token = this.authService.getAuthToken();
      if (token) {
        const requestData = {
          token: token
        };
        return axios.post(this.baseUrl + 'dashboard', requestData)
          .then(response => {
            return response.data;
          })
          .catch(error => {
            // Handle error
            console.error('Error fetching user profile:', error);
            throw error;
          });
      } else {
        // Token not available, logout user
        this.authService.logout();
        return Promise.reject('Token not available');
      }

    } else {
      return Promise.reject('User not logged in');
    }
  }

  getUser(){
    return axios.post(this.baseUrl + 'userDetails',{"token":this.authService.getAuthToken()});
  }
  
  updateUser(data:any){
    return axios.post(this.baseUrl + 'updateUser',{"token":this.authService.getAuthToken(),...data});
  }
  
  createCampaign(campaignData:any){
    return axios.post(this.baseUrl + 'campaign',{...campaignData,"token":this.authService.getAuthToken()});
  }

  getAllCampaignBySameUserId(){
    return axios.post(this.baseUrl + 'getAllCampaignsWithId',{"token":this.authService.getAuthToken()});
  }

  getAllCampaignDonations(campaign:any){
    return axios.post(this.baseUrl + 'getAllCampaignDonations',{'campaign':campaign});
  }

  getAllActiveCampaigns(){
    return axios.get(this.baseUrl + 'getAllActiveCampaigns');
  }

  getCampaignById(id:string){
    
    return axios.get(this.baseUrl + 'details/'+id);

  }
  updateCampaignCurrentAmount(data:any){
    
    return axios.post(this.baseUrl + 'updateCampaignCurrentAmount',data);

  }

  createDonationEntry(data:any){

    return axios.post(this.baseUrl + 'createDonationEntry',{...data,'token':this.authService.getAuthToken()});

  }

  userDonationsById(){
    return axios.post(this.baseUrl + 'getUserAllDonations',{'token':this.authService.getAuthToken()});
  }

  deleteCampaign(campId:any){
    return axios.post(this.baseUrl + 'campaign/destroy',{'campId':campId,'token':this.authService.getAuthToken()});
  }

  deactivateCampaign(campId:any){
    return axios.post(this.baseUrl + 'deactivateCampaignById',{'campId':campId,'token':this.authService.getAuthToken()});
    
  }


  activateCampaign(campId:any){
    console.log(campId,"backend service called active camp");
    return axios.post(this.baseUrl + 'activateCampaign',{'campId':campId,'token':this.authService.getAuthToken()});
  }


  contactWishwell(data:any){
    
    console.log(data)
    
    return axios.post(this.baseUrl + 'contacts',{...{
      "email": "john@example.com",
      "subject": "Test Subject",
      "name": "John Doe",
      "message": "This is a test message."
    },'token':this.authService.getAuthToken()});

  }



}
