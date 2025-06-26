import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddEditJobCardTyreChangeRoutingModule } from './add-edit-job-card-tyre-change-routing.module';
import { JobCardTyreChangeComponent } from './job-card-tyre-change/job-card-tyre-change.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { JobCardPaymentModuleModule } from '../job-card-payment-module/job-card-payment-module.module';
import { TyreDetailsViewComponent } from './tyre-details-view/tyre-details-view.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [
    JobCardTyreChangeComponent,
    TyreDetailsViewComponent, 
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    JobCardPaymentModuleModule,
    AddEditJobCardTyreChangeRoutingModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatTooltipModule
  ],
  exports:[
    TyreDetailsViewComponent
  ]
})
export class AddEditJobCardTyreChangeModule { }
