import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpareReportSummaryRoutingModule } from './spare-report-summary-routing.module';
import { FormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { SpareSummaryComponent } from './spare-summary.component';


@NgModule({
  declarations: [SpareSummaryComponent],
  imports: [
    CommonModule,
    SpareReportSummaryRoutingModule,
    MatSortModule,
    FormsModule,
    NgxPaginationModule,
    SharedModule
  ]
})
export class SpareReportSummaryModule { }
