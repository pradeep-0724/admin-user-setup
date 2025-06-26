import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgingReportOperationalBillsModuleRoutingModule } from './aging-report-operational-bills-module-routing.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { AgingReportOperationalBillsComponent } from './aging-report-operational-bills.component';
import { ListModuleV2 } from '../../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';


@NgModule({
  declarations: [AgingReportOperationalBillsComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ListModuleV2,
    AgingReportOperationalBillsModuleRoutingModule
  ]
})
export class AgingReportOperationalBillsModule{ }
