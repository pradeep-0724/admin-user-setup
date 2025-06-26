import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RateCardModuleRoutingModule } from './rate-card-module-routing.module';
import { RateCardComponent } from './rate-card/rate-card.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { DateAdapter } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { MaterialDropDownModule } from '../../../material-drop-down-module/material-drop-down-module.module';
import { ToolTipModule } from '../../../sub-main-trip-module/new-trip-v2/tool-tip/tool-tip.module';
import { AdditionalChargeRateCardComponent } from './additional-charge-rate-card/additional-charge-rate-card.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AddAdditionalChargePopupModule } from './add-additional-charge-popup/add-additional-charge-popup-module.module';
import { CustomerRateCardComponent } from './customer-rate-card/customer-rate-card.component';


@NgModule({
  declarations: [
    RateCardComponent,
    AdditionalChargeRateCardComponent,
    CustomerRateCardComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    RateCardModuleRoutingModule,
    SharedModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MaterialDropDownModule,
    AppErrorModuleModule,
    ToolTipModule,
    MatMomentDateModule,
    AddAdditionalChargePopupModule,
    MatCheckboxModule
  ],

  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }]
})
export class RateCardModuleModule { }
