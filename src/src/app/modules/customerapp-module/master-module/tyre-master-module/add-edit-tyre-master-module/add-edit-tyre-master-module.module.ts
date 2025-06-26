import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditTyreMasterModuleRoutingModule } from './add-edit-tyre-master-module-routing.module';
import { VehicleTyreMasterComponent } from './vehicle-tyre-master/vehicle-tyre-master.component';
import { ReactiveFormsModule } from '@angular/forms';
import { VideoPlayModule } from '../../../video-play-module/video-play-module.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { MaterialDropDownModule } from '../../../material-drop-down-module/material-drop-down-module.module';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { TyreMasterAddEditService } from '../../../api-services/master-module-services/tyre-master-service/tyre-master-add-edit-service.service';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { VehicleTyrePositionLayoutModule } from '../vehicle-tyre-position-layout/vehicle-tyre-position-layout.module';


@NgModule({
  declarations: [VehicleTyreMasterComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialDropDownModule,
    VideoPlayModule,
    NgxPermissionsModule.forChild(),
    AlertPopupModuleModule,
    SharedModule,
    AppErrorModuleModule,
    VehicleTyrePositionLayoutModule,
    AddEditTyreMasterModuleRoutingModule
  ],
  providers:[TyreMasterAddEditService]
})
export class AddEditTyreMasterModule { }
