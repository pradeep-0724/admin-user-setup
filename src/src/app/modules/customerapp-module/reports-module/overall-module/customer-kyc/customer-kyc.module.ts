import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerKycRoutingModule } from './customer-kyc-routing.module';
import { CustomerKycComponent } from './customer-kyc/customer-kyc.component';
import { ListModuleV2 } from '../../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    CustomerKycComponent
  ],
  imports: [
    CommonModule,
    CustomerKycRoutingModule,
    ListModuleV2,
    RouterModule,
  ]
})
export class CustomerKycModule { }
