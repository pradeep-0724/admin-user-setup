import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditTripFreightModule } from '../edit-trip-freight/edit-trip-freight-module.module';
import { TripChargesModule } from '../trip-charges-module/trip-charges-module.module';
import { TripOtherExpenseModule } from '../trip-other-expense/trip-other-expense-module.module';
import { PartyAdvanceFuelModule } from '../party-advance-fuel/party-advance-fuel-module.module';
import { PartyAdvanceDriverModule } from '../party-advance-driver/party-advance-driver-module.module';
import { SelfFuelModule } from '../self-fuel/self-fuel-module.module';
import { PartyAdvanceModule } from '../party-advance/party-advance-module.module';
import { SelfDriverModule } from '../self-driver/self-driver-module.module';
import { UploadPodModule } from '../upload-pod/upload-pod-module.module';
import { EditTripNewPopUpComponent } from './edit-trip-new-pop-up.component';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { MatIconModule } from '@angular/material/icon';
import { BillingTypesV2Module } from '../../../new-trip-v2/billing-types-v2/billing-types-v2.module';



@NgModule({
  declarations: [EditTripNewPopUpComponent],
  imports: [
    CommonModule,
    EditTripFreightModule,
    TripChargesModule,
    TripOtherExpenseModule,
    PartyAdvanceFuelModule,
    PartyAdvanceDriverModule,
    SelfFuelModule,
    PartyAdvanceModule,
    SelfDriverModule,
    MatIconModule,
    AlertPopupModuleModule,
    UploadPodModule,
    BillingTypesV2Module
  ],
  exports:[EditTripNewPopUpComponent]
})
export class EditTripNewPopUpModule { }
