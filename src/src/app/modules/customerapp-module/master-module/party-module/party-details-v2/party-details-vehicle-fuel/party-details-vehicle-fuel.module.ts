import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartyDetailsVehicleFuelRoutingModule } from './party-details-vehicle-fuel-routing.module';
import { TableWidgetModule } from '../../../vehicle-module/own-venicle-module/vehicle-details-v2/table-widget-module/table-widget-module.module';
import { PartyDetailsFuelProviderComponent } from './party-details-fuel-provider/party-details-fuel-provider.component';
import { PartyDetailsFuelProviderHeaderComponent } from './party-details-fuel-provider-header/party-details-fuel-provider-header.component';
import { PartyDetailsFuelProviderInfoComponent } from './party-details-fuel-provider-info/party-details-fuel-provider-info.component';
import { PartyDetailsFuelProviderTransactionsComponent } from './party-details-fuel-provider-transactions/party-details-fuel-provider-transactions.component';
import { PartyDetailsFuelProviderSummaryComponent } from './party-details-fuel-provider-summary/party-details-fuel-provider-summary.component';
import { FileDeleteViewModule } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/new-trip-details-v2/file-delete-view-module/file-delete-view-module.module';
import { SharedModule } from 'src/app/shared-module/shared.module';


@NgModule({
  declarations: [
    PartyDetailsFuelProviderComponent,
    PartyDetailsFuelProviderHeaderComponent,
    PartyDetailsFuelProviderInfoComponent,
    PartyDetailsFuelProviderTransactionsComponent,
    PartyDetailsFuelProviderSummaryComponent
  ],
  imports: [
    CommonModule,
    PartyDetailsVehicleFuelRoutingModule,
    TableWidgetModule,
    SharedModule,
    FileDeleteViewModule
  ],
  exports:[PartyDetailsFuelProviderSummaryComponent],
})
export class PartyDetailsVehicleFuelModule { }
