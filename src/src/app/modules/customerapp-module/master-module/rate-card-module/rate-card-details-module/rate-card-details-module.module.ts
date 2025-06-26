import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RateCardDetailsModuleRoutingModule } from './rate-card-details-module-routing.module';
import { RateCardDetailsComponent } from './rate-card-details/rate-card-details.component';
import { RateCardHeaderDetailsComponent } from './rate-card-header-details/rate-card-header-details.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ContainerCommonRateCardDetailsComponent } from './container-common-rate-card-details/container-common-rate-card-details.component';
import { SharedModule } from 'src/app/shared-module/shared.module';


@NgModule({
  declarations: [
    RateCardDetailsComponent,
    RateCardHeaderDetailsComponent,
    ContainerCommonRateCardDetailsComponent,
  ],
  imports: [
    CommonModule,
    MatCheckboxModule,
    SharedModule,
    NgxPermissionsModule,
    RateCardDetailsModuleRoutingModule
  ]
})
export class RateCardDetailsModuleModule { }
