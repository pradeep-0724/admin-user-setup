import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverallTripReportRoutingModule } from './overall-trip-report-routing.module';
import { OverallTripReportComponent } from './overall-trip-report/overall-trip-report.component';
import { FileDeleteViewModule } from '../../../sub-main-trip-module/new-trip-v2/new-trip-details-v2/file-delete-view-module/file-delete-view-module.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TableWidgetModule } from '../../../master-module/vehicle-module/own-venicle-module/vehicle-details-v2/table-widget-module/table-widget-module.module';
import { OverallTripReportHeaderComponent } from './overall-trip-report-header/overall-trip-report-header.component';
import { OverallTripReportOverviewComponent } from './overall-trip-report-overview/overall-trip-report-overview.component';
import { OverallTripReportDriversTripInfoComponent } from './overall-trip-report-drivers-trip-info/overall-trip-report-drivers-trip-info.component';
import { OverallTripReportVehiclesTripInfoComponent } from './overall-trip-report-vehicles-trip-info/overall-trip-report-vehicles-trip-info.component';
import { OverallTripReportClientsTripInfoComponent } from './overall-trip-report-clients-trip-info/overall-trip-report-clients-trip-info.component';
import { OverallTripReportVehicleProvidersTripInfoComponent } from './overall-trip-report-vehicle-providers-trip-info/overall-trip-report-vehicle-providers-trip-info.component';
import { MatRippleModule } from '@angular/material/core';
import { ToolTipModule } from '../../../sub-main-trip-module/new-trip-v2/tool-tip/tool-tip.module';
import { SharedModule } from 'src/app/shared-module/shared.module';


@NgModule({
  declarations: [
    OverallTripReportComponent,
    OverallTripReportHeaderComponent,
    OverallTripReportOverviewComponent,
    OverallTripReportDriversTripInfoComponent,
    OverallTripReportVehiclesTripInfoComponent,
    OverallTripReportClientsTripInfoComponent,
    OverallTripReportVehicleProvidersTripInfoComponent
  ],
  imports: [
    CommonModule,
    ToolTipModule,
    OverallTripReportRoutingModule,
    TableWidgetModule,
    FileDeleteViewModule,
    FormsModule,
    RouterModule,
    SharedModule,
    MatRippleModule,
  ]
})
export class OverallTripReportModule { }
