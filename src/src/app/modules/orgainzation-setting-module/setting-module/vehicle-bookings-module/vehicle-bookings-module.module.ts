import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleBookingsModuleRoutingModule } from './vehicle-bookings-module-routing.module';
import { VehicleBookingPrefrencesComponent } from './vehicle-booking-prefrences/vehicle-booking-prefrences.component';
import { VehicleBookingsComponent } from './vehicle-bookings.component';
import { OrganizationSharedModeule } from '../organization-shared-modeule/organization-shared-modeule.module';

@NgModule({
  declarations: [VehicleBookingPrefrencesComponent, VehicleBookingsComponent],
  imports: [
    CommonModule,
    VehicleBookingsModuleRoutingModule,
    OrganizationSharedModeule
  ]
})
export class VehicleBookingsModuleModule { }
