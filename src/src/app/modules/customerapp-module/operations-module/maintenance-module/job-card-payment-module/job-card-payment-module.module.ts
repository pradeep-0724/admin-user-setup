import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobCardPaymentsComponent } from './job-card-payments/job-card-payments.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { AddPartyPopupModule } from '../../../master-module/party-module/add-party-popup-module/add-party-popup-module.module';



@NgModule({
  declarations: [
    JobCardPaymentsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    AddPartyPopupModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatCheckboxModule,
    MatRadioModule,
  ],
  exports:[JobCardPaymentsComponent]
})
export class JobCardPaymentModuleModule { }
