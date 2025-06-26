import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgingReportInvoiceModuleRoutingModule } from './aging-report-invoice-module-routing.module';
import { FormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { InvoiceAgingSearch } from './aging-invoice.pipe';
import { AgingReportInvoiceComponent } from './aging-report-invoice.component';
import { ListModuleV2 } from '../../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';


@NgModule({
  declarations: [InvoiceAgingSearch,AgingReportInvoiceComponent],
  imports: [
    CommonModule,
    ListModuleV2,
    SharedModule,
    FormsModule,
    MatSortModule,
    NgxPaginationModule,
    AgingReportInvoiceModuleRoutingModule
  ]
})
export class AgingReportInvoiceModule{ }
