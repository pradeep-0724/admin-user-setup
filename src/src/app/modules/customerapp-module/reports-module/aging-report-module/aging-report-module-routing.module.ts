import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [{
  path:'invoice',
  loadChildren:()=> import('./aging-report-invoice/aging-report-invoice-module.module').then(m=>m.AgingReportInvoiceModule)
},
{
  path:'bos',
  loadChildren:()=> import('./aging-report-bos/aging-report-bos-module.module').then(m=>m.AgingReportBosModule)
},
{
  path:'operation_bill',
 loadChildren:() => import('./aging-report-operational-bills/aging-report-operational-bills-module.module').then(m=>m.AgingReportOperationalBillsModule)
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgingReportModuleRoutingModule { }
