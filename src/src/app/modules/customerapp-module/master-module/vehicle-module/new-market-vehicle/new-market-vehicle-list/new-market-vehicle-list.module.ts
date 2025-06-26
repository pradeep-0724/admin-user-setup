import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewMarketVehicleListRoutingModule } from './new-market-vehicle-list-routing.module';
import { NewMarketVehicleListComponent } from './new-market-vehicle-list/new-market-vehicle-list.component';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { ListModuleV2 } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';
import { GoThroughModule } from 'src/app/modules/customerapp-module/go-through/go-through.module';
import { NgxPermissionsModule } from 'ngx-permissions';


@NgModule({
  declarations: [
    NewMarketVehicleListComponent
  ],
  imports: [
    CommonModule,
    AlertPopupModuleModule,
    GoThroughModule,
    ListModuleV2,
    NewMarketVehicleListRoutingModule,
    NgxPermissionsModule.forChild()
  ]
})
export class NewMarketVehicleListModule { }
