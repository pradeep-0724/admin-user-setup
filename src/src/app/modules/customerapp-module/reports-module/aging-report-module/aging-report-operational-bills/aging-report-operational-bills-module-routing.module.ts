import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgingReportOperationalBillsComponent } from './aging-report-operational-bills.component';

const routes: Routes = [
  {
    path:'',
    component:AgingReportOperationalBillsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgingReportOperationalBillsModuleRoutingModule { }
