import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleBookingModuleRoutingModule } from './vehicle-booking-module-routing.module';
import { VehicleBookingComponent } from './vehicle-booking/vehicle-booking.component';
import { SharedModule } from './../../../shared-module/shared.module';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ReactiveFormsModule ,FormsModule} from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AddVehiclePopupComponent } from './add-vehicle-popup/add-vehicle-popup.component';
import { MatChipsModule} from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { NgxPermissionsModule } from 'ngx-permissions';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AddPartyPopupModule } from '../master-module/party-module/add-party-popup-module/add-party-popup-module.module';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';



@NgModule({
  declarations: [VehicleBookingComponent, AddVehiclePopupComponent],
  imports: [
    CommonModule,
    VehicleBookingModuleRoutingModule,
    SharedModule,
    NgMultiSelectDropDownModule.forRoot(),
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,

      useFactory: adapterFactory,
    }),
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    NgxPaginationModule,
    MatIconModule,
    NgxPermissionsModule.forChild(),
    ReactiveFormsModule,
    FormsModule,
    MatChipsModule,
    AddPartyPopupModule,
    MatFormFieldModule,
    MatInputModule,
    MatMomentDateModule,
    BsDatepickerModule.forRoot(),
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],

})
export class VehicleBookingModuleModule { }
