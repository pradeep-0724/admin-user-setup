import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleListModuleRoutingModule } from './vehicle-list-module-routing.module';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { FormsModule } from '@angular/forms';
import { VideoPlayModule } from '../../../../video-play-module/video-play-module.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ListModuleV2 } from '../../../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';
import { GoThroughModule } from '../../../../go-through/go-through.module';


@NgModule({
  declarations: [VehicleListComponent],
  imports: [
    CommonModule,
    VehicleListModuleRoutingModule,
    FormsModule,
    GoThroughModule,
    SharedModule,
    NgxPermissionsModule.forChild(),
    VideoPlayModule,
    ListModuleV2
  ]
})
export class VehicleListModule { }
