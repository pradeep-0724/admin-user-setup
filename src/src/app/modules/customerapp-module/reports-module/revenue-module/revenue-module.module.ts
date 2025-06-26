import { RevenueReportRoutingModule } from './revenue.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RevenueReportRoutingModule,
    BsDatepickerModule.forRoot()
  ]
})
export class RevenueModule { }
