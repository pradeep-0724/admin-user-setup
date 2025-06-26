import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleTypeReportRoutingModule } from './vehicle-type-report-routing.module';
import { TableWidgetModule } from '../../../master-module/vehicle-module/own-venicle-module/vehicle-details-v2/table-widget-module/table-widget-module.module';
import { VehicleTypeInfoHeaderComponent } from './vehicle-type-info-header/vehicle-type-info-header.component';
import { VehicleInfoComponent } from './vehicle-info/vehicle-info.component';
import { VehicleTypeReportComponent } from './vehicle-type-report/vehicle-type-report.component';
import { SharedModule } from 'src/app/shared-module/shared.module';



@NgModule({
  declarations: [
    VehicleTypeReportComponent,
    VehicleTypeInfoHeaderComponent,
    VehicleInfoComponent
  ],
  imports: [
    CommonModule,
    TableWidgetModule,
    SharedModule,
    VehicleTypeReportRoutingModule
  ]
})
export class VehicleTypeReportModule { }
