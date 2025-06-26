import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PasswordModuleRoutingModule } from './password-module-routing.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { EmailRedirectComponent } from './email-redirect/email-redirect.component';

@NgModule({
  declarations: [ChangePasswordComponent, ForgetPasswordComponent, EmailRedirectComponent],
  imports: [
    CommonModule,
    PasswordModuleRoutingModule,
    SharedModule,
		ReactiveFormsModule,
		FormsModule
  ]
})
export class PasswordModuleModule { }
