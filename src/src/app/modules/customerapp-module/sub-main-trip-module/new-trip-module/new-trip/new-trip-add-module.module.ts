import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewTripAddModuleRoutingModule } from './new-trip-add-module-routing.module';
import { NewTripComponent } from './new-trip.component';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { TaxModuleModule } from 'src/app/tax-module/tax-module.module';
import { AddItemModule } from '../../../master-module/item-module/add-item-module/add-item-module.module';
import { AddPartyPopupModule } from '../../../master-module/party-module/add-party-popup-module/add-party-popup-module.module';
import { VideoPlayModule } from '../../../video-play-module/video-play-module.module';
import { BillingTypesModule } from './billing-types-module/billing-types-module.module';
import { DriverLedgerPopupModule } from './driver-ledger-poppup/driver-ledger-popup-module.module';
import { PartyAdvanceDriverModule } from './party-advance-driver/party-advance-driver-module.module';
import { SelfDriverModule } from './self-driver/self-driver-module.module';
import { SelfFuelModule } from './self-fuel/self-fuel-module.module';
import { TripChargesModule } from './trip-charges-module/trip-charges-module.module';
import { TripFuelExpenseModule } from './trip-fuel-expenses/trip-fuel-expense-module.module';
import { TripOtherExpenseModule } from './trip-other-expense/trip-other-expense-module.module';
import { PartyAdvanceModule } from './party-advance/party-advance-module.module';
import { PartyAdvanceFuelModule } from './party-advance-fuel/party-advance-fuel-module.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { PlacesAutoCompleteModule } from '../../../places-auto-complete/places-auto-complete.module';
import { AddNewVehicleModule } from './add-new-vehicle-popup/add-new-vehicle.module';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';



@NgModule({
  declarations: [NewTripComponent ],
  imports: [
    CommonModule,
    NewTripAddModuleRoutingModule,
    MatDatepickerModule,
    MatNativeDateModule,
    PartyAdvanceDriverModule,
    MatCheckboxModule,
    MatIconModule,
    TaxModuleModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    VideoPlayModule,
    AddPartyPopupModule,
    PartyAdvanceModule,
    NgxMatMomentModule,
    NgxPermissionsModule.forChild(),
    PartyAdvanceFuelModule,
    AddItemModule,
    BillingTypesModule,
    TripOtherExpenseModule,
    SelfFuelModule,
    TripChargesModule,
    SelfDriverModule,
    DriverLedgerPopupModule,
    TripFuelExpenseModule,
    PlacesAutoCompleteModule,
    MatMomentDateModule,
    AddNewVehicleModule
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
})
export class NewTripAddModule { }
