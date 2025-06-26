import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddEditJobCardServiceRoutingModule } from './add-edit-job-card-service-routing.module';
import { JobCardServiceComponent } from './job-card-service/job-card-service.component';
import { ServiceListSearchPipe } from './services-list/service-list-search.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServicesListComponent } from './services-list/services-list.component';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { JobCardPaymentModuleModule } from '../job-card-payment-module/job-card-payment-module.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ServiceHistoryModule } from './service-history-list/service-history-module.module';
@NgModule({
  declarations: [
    JobCardServiceComponent,
    ServiceListSearchPipe,
    ServicesListComponent,
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ServiceHistoryModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    AddEditJobCardServiceRoutingModule,
    JobCardPaymentModuleModule
  ]
})
export class AddEditJobCardServiceModule { }
