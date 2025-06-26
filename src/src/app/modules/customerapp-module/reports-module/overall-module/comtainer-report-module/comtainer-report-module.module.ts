import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComtainerReportModuleRoutingModule } from './comtainer-report-module-routing.module';
import { ContainerReportComponent } from './container-report/container-report.component';
import { ListModuleV2 } from '../../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';


@NgModule({
  declarations: [
    ContainerReportComponent
  ],
  imports: [
    CommonModule,
    ListModuleV2,
    ComtainerReportModuleRoutingModule
  ]
})
export class ComtainerReportModule { }
