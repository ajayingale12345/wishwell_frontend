// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { MainComponent } from './main/main.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { DetailsComponent } from './details/details.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './auth.guard';
import { AuthGuardLoginRegister } from './loginRegistrationAuth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'main', component: MainComponent},
  { path: 'register', component: RegisterComponent , canActivate: [AuthGuardLoginRegister] },
  { path: 'login', component: LoginComponent , canActivate: [AuthGuardLoginRegister] },
  
  { path: 'details/:id', component: DetailsComponent, canActivate: [AuthGuard]  },

  { path: 'profile', component: ProfileComponent , canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
