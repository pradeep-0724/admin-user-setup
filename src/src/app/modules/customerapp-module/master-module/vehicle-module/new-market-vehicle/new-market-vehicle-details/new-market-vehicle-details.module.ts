import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewMarketVehicleDetailsRoutingModule } from './new-market-vehicle-details-routing.module';
import { NewMarketVehicleDetailsComponent } from './new-market-vehicle-details/new-market-vehicle-details.component';
import { NewMarketVehicleHeaderDetailsComponent } from './new-market-vehicle-header-details/new-market-vehicle-header-details.component';
import { NewMarketDetailsVehicleInfoComponent } from './new-market-details-vehicle-info/new-market-details-vehicle-info.component';
import { NewMarketDetiailsTripHistoryComponent } from './new-market-detiails-trip-history/new-market-detiails-trip-history.component';
import { MatRippleModule } from '@angular/material/core';
import { TableWidgetModule } from '../../own-venicle-module/vehicle-details-v2/table-widget-module/table-widget-module.module';
import { ViewUploadedDocumentModule } from 'src/app/modules/orgainzation-setting-module/organiation-profile-v2/view-uploaded-document/view-uploaded-document.module';
import { VehicleSharedModuleModule } from '../../vehicle-shared-module/vehicle-shared-module.module';
import { SharedModule } from 'src/app/shared-module/shared.module';


@NgModule({
  declarations: [
    NewMarketVehicleDetailsComponent,
    NewMarketVehicleHeaderDetailsComponent,
    NewMarketDetailsVehicleInfoComponent,
    NewMarketDetiailsTripHistoryComponent
  ],
  imports: [
    CommonModule,
    NewMarketVehicleDetailsRoutingModule,
    MatRippleModule,
    TableWidgetModule,
    SharedModule,
    ViewUploadedDocumentModule,
    VehicleSharedModuleModule
  ]
})
export class NewMarketVehicleDetailsModule { }
