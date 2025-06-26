import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesByCustomerReportComponent } from './sales-by-customer-report/sales-by-customer-report.component';

const routes: Routes = [
  {
    path:'',
    component: SalesByCustomerReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesByCustomerRoutingModule { }
