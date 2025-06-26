import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartyDetailsVehicleProviderRoutingModule } from './party-details-vehicle-provider-routing.module';
import { TableWidgetModule } from '../../../vehicle-module/own-venicle-module/vehicle-details-v2/table-widget-module/table-widget-module.module';
import { VehicleProviderInfoComponent } from './vehicle-provider-info/vehicle-provider-info.component';
import { PartyVehicleProviderComponent } from './party-vehicle-provider/party-vehicle-provider.component';
import { PartyVehicleProviderTripSummaryComponent } from './party-vehicle-provider-trip-summary/party-vehicle-provider-trip-summary.component';
import { PartyVehicleProviderTransactionsComponent } from './party-vehicle-provider-transactions/party-vehicle-provider-transactions.component';
import { PartyVehicleProviderHeaderComponent } from './party-vehicle-provider-header/party-vehicle-provider-header.component';
import { FileDeleteViewModule } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/new-trip-details-v2/file-delete-view-module/file-delete-view-module.module';
import {  MatRippleModule } from '@angular/material/core';
import { SharedModule } from 'src/app/shared-module/shared.module';


@NgModule({
  declarations: [
    VehicleProviderInfoComponent,
    PartyVehicleProviderComponent,
    PartyVehicleProviderTripSummaryComponent,
    PartyVehicleProviderTransactionsComponent,
    PartyVehicleProviderHeaderComponent
  ],
  imports: [
    CommonModule,
    PartyDetailsVehicleProviderRoutingModule,
    TableWidgetModule,
    SharedModule,
    FileDeleteViewModule,
    MatRippleModule
  ],
  exports:[PartyVehicleProviderTripSummaryComponent]
})
export class PartyDetailsVehicleProviderModule { }
