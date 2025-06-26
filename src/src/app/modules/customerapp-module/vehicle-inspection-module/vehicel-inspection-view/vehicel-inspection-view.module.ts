import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehicelInspectionViewRoutingModule } from './vehicel-inspection-view-routing.module';
import { VehicleInspectionViewComponent } from './vehicle-inspection-view/vehicle-inspection-view.component';
import { FileDeleteViewModule } from '../../sub-main-trip-module/new-trip-v2/new-trip-details-v2/file-delete-view-module/file-delete-view-module.module';
import { DateFormaterModule } from '../../date-formater/date-formater.module';
import { NgxPermissionsModule } from 'ngx-permissions';


@NgModule({
  declarations: [
    VehicleInspectionViewComponent
  ],
  imports: [
    CommonModule,
    FileDeleteViewModule,
    DateFormaterModule,
    NgxPermissionsModule.forChild(),
    VehicelInspectionViewRoutingModule
  ]
})
export class VehicelInspectionViewModule { }
