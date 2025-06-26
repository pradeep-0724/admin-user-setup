import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartyDetailsMaintenanceRoutingModule } from './party-details-maintenance-routing.module';
import { PartyDetailsMaintenanceComponent } from './party-details-maintenance/party-details-maintenance.component';
import { PartyDetailsMaintenancePartyInfoComponent } from './party-details-maintenance-party-info/party-details-maintenance-party-info.component';
import { PartyDetailsMaintenancePartyTransactionsComponent } from './party-details-maintenance-party-transactions/party-details-maintenance-party-transactions.component';
import { PartyDetailsMaintenancePartyTripSummaryComponent } from './party-details-maintenance-party-trip-summary/party-details-maintenance-party-trip-summary.component';
import { PartyDetailsMaintenanceHeaderComponent } from './party-details-maintenance-header/party-details-maintenance-header.component';
import { TableWidgetModule } from '../../../vehicle-module/own-venicle-module/vehicle-details-v2/table-widget-module/table-widget-module.module';
import { FileDeleteViewModule } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/new-trip-details-v2/file-delete-view-module/file-delete-view-module.module';
import { PartyDetailsVehicleFuelModule } from '../party-details-vehicle-fuel/party-details-vehicle-fuel.module';
import { PartyDetailsVehicleProviderModule } from '../party-details-vehicle-provider/party-details-vehicle-provider.module';
import {  MatRippleModule } from '@angular/material/core';
import { SharedModule } from 'src/app/shared-module/shared.module';


@NgModule({
  declarations: [
    PartyDetailsMaintenanceComponent,
    PartyDetailsMaintenancePartyInfoComponent,
    PartyDetailsMaintenancePartyTransactionsComponent,
    PartyDetailsMaintenancePartyTripSummaryComponent,
    PartyDetailsMaintenanceHeaderComponent
  ],
  imports: [
    CommonModule,
    PartyDetailsMaintenanceRoutingModule,
    TableWidgetModule,
    SharedModule,
    FileDeleteViewModule,
    PartyDetailsVehicleFuelModule,
    PartyDetailsVehicleProviderModule,
    MatRippleModule
  ]
})
export class PartyDetailsMaintenanceModule { }
