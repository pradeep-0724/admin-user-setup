import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddChangePasswordRoutingModule } from './add-change-password-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { AddChangePasswordComponent } from './add-change-password.component';


@NgModule({
  declarations: [AddChangePasswordComponent],
  imports: [
    CommonModule,
    AddChangePasswordRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    SharedModule,
  ]
})
export class AddChangePasswordModule { }
