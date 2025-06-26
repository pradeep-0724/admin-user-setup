import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TyreMasterListDetailsModuleRoutingModule } from './tyre-master-list-details-module-routing.module';
import { VehicleTyreMasterListComponent } from './vehicle-tyre-master-list/vehicle-tyre-master-list.component';
import { VehicleTyreMasterDetailsComponent } from './vehicle-tyre-master-details/vehicle-tyre-master-details.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { VideoPlayModule } from '../../../video-play-module/video-play-module.module';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { TyreLayoutViewComponent } from './tyre-layout-view/tyre-layout-view.component';
import { VehicleTyrePositionLayoutModule } from '../vehicle-tyre-position-layout/vehicle-tyre-position-layout.module';
import { ListModuleV2 } from '../../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';
import { TyremasterListService } from '../../../api-services/master-module-services/tyre-master-service/tyremaster-list-service.service';


@NgModule({
  declarations: [VehicleTyreMasterListComponent,VehicleTyreMasterDetailsComponent, TyreLayoutViewComponent],
  imports: [
    CommonModule,
    VideoPlayModule,
    NgxPermissionsModule.forChild(),
    AlertPopupModuleModule,
    VehicleTyrePositionLayoutModule,
    ListModuleV2,
    TyreMasterListDetailsModuleRoutingModule
  ],
  providers:[TyremasterListService]
})
export class TyreMasterListDetailsModule { }
