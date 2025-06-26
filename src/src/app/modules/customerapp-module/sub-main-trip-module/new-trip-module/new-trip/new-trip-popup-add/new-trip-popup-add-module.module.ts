import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartyAdvanceDriverModule } from '../party-advance-driver/party-advance-driver-module.module';
import { PartyAdvanceFuelModule } from '../party-advance-fuel/party-advance-fuel-module.module';
import { PartyAdvanceModule } from '../party-advance/party-advance-module.module';
import { SelfDriverModule } from '../self-driver/self-driver-module.module';
import { SelfFuelModule } from '../self-fuel/self-fuel-module.module';
import { TripChargesModule } from '../trip-charges-module/trip-charges-module.module';
import { TripOtherExpenseModule } from '../trip-other-expense/trip-other-expense-module.module';
import { UploadedPodModule } from '../uploaded-pod/uploaded-pod-module.module';
import { NewTripPopupAddComponent } from './new-trip-popup-add.component';
import { MatIconModule } from '@angular/material/icon';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';



@NgModule({
  declarations: [NewTripPopupAddComponent],
  imports: [
    CommonModule,
    SelfFuelModule,
    PartyAdvanceFuelModule,
    SelfDriverModule,
    PartyAdvanceDriverModule,
    TripOtherExpenseModule,
    MatIconModule,
    TripChargesModule,
    PartyAdvanceModule,
    AlertPopupModuleModule,
    UploadedPodModule
  ],
  exports:[NewTripPopupAddComponent]
})
export class NewTripPopupAddModule { }
