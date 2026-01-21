import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Login } from './login/login';
import { Register } from './register/register';
import { AppRoutingModule } from "../app-routing-module";
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Eye, EyeOff } from 'lucide-angular';

@NgModule({
  declarations: [
    Login,
    Register
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppRoutingModule,
    RouterModule,
    LucideAngularModule.pick({ Eye, EyeOff }),  
  ],
})
export class AuthModule { }
