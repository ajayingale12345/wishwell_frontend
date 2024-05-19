import { NgModule} from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { ToastrModule, ToastNoAnimation, ToastNoAnimationModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { MainComponent } from './main/main.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { DetailsComponent } from './details/details.component';
import { ProfileComponent } from './profile/profile.component'; 
import { FooterComponent } from './footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({

  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ContactComponent,
    MainComponent,
    RegisterComponent,
    LoginComponent,
    DetailsComponent,
    ProfileComponent,
    FooterComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ToastNoAnimationModule.forRoot(),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
  ],

  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

