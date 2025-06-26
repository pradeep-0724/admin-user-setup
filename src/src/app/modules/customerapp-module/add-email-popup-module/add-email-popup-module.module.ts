import { SharedModule } from './../../../shared-module/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEmailComponent } from './add-email/add-email.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import {  MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [AddEmailComponent],
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule,MatFormFieldModule,MatChipsModule,MatIconModule,
    SharedModule
  ],
  exports: [AddEmailComponent],
})
export class AddEmailPopupModule { }
