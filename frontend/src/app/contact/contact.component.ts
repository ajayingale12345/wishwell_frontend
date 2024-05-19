// contact.component.ts
import { Component } from '@angular/core';
import { ServiceBackend } from '../service-backend.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  formData: any = {}; // Placeholder object to store form data

  constructor( 
    private serviceBackend: ServiceBackend,
    private toaster:ToastrService
  ) { }

  submitForm(): void {

    this.serviceBackend.contactWishwell(this.formData).then((data)=>{

      this.toaster.success("we will consider your request and rach back to you")

      this.formData = {};

    }).catch((error)=>{
    
      this.toaster.error("problem submitting contact")

    })


  }
}
