import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesByCustomerRoutingModule } from './sales-by-customer-routing.module';
import { SalesByCustomerHeaderComponent } from './sales-by-customer-header/sales-by-customer-header.component';
import { SalesByCustomerInfoComponent } from './sales-by-customer-info/sales-by-customer-info.component';
import { SalesByCustomerReportComponent } from './sales-by-customer-report/sales-by-customer-report.component';
import { TableWidgetModule } from '../../../master-module/vehicle-module/own-venicle-module/vehicle-details-v2/table-widget-module/table-widget-module.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared-module/shared.module';


@NgModule({
  declarations: [
    SalesByCustomerHeaderComponent,
    SalesByCustomerInfoComponent,
    SalesByCustomerReportComponent
  ],
  imports: [
    CommonModule,
    TableWidgetModule,
    FormsModule,
    SharedModule,
    SalesByCustomerRoutingModule
  ]
})
export class SalesByCustomerModule { }
