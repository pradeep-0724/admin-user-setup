import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleInspectionListModuleRoutingModule } from './vehicle-inspection-module-routing.module';
import { VehicleInspectionListComponent } from './vehicle-inspection-list.component';
import { ListModuleV2 } from '../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { ListSiteInspectionRoutingModule } from '../../sub-main-trip-module/site-inspection-module/list-site-inspection/list-site-inspection-routing.module';
import { NgxPermissionsModule } from 'ngx-permissions';


@NgModule({
  declarations: [
    VehicleInspectionListComponent
  ],
  imports: [
    CommonModule,
    ListModuleV2,
    AlertPopupModuleModule,
    ListSiteInspectionRoutingModule,
    NgxPermissionsModule.forChild(),

    VehicleInspectionListModuleRoutingModule
  ]
})
export class VehicleInspectionListModuleModule { }
