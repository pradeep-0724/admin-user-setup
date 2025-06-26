import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { TripDaysComponent } from './trip-days/trip-days.component';
import { TripFixedComponent } from './trip-fixed/trip-fixed.component';
import { TripHourComponent } from './trip-hour/trip-hour.component';
import { TripKgsComponent } from './trip-kgs/trip-kgs.component';
import { TripKmsComponent } from './trip-kms/trip-kms.component';
import { TripLitersComponent } from './trip-liters/trip-liters.component';
import { TripTonnesComponent } from './trip-tonnes/trip-tonnes.component';
import { TripGallonsComponent } from './trip-gallons/trip-gallons.component';
import { AddItemModule } from 'src/app/modules/customerapp-module/master-module/item-module/add-item-module/add-item-module.module';
import { TripUnitsComponent } from './trip-units/trip-units.component';
import { DateAdapter } from '@angular/material/core';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';



@NgModule({
  declarations: [TripTonnesComponent, TripKgsComponent, TripKmsComponent, TripLitersComponent, TripHourComponent,
    TripDaysComponent, TripFixedComponent, TripGallonsComponent, TripUnitsComponent,],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    SharedModule,
    AddItemModule,
    MatMomentDateModule,
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
  exports:[TripTonnesComponent, TripKgsComponent, TripKmsComponent, TripLitersComponent, TripHourComponent,
    TripDaysComponent, TripFixedComponent,TripGallonsComponent,TripUnitsComponent]
})
export class BillingTypesModule{ }
