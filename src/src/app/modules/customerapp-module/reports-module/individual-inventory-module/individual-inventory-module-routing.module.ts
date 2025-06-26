import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
   path: 'spare-summary' + '/:spare_id',
  loadChildren:() => import('./individual-inventory-reports/individual-inventory-reports.module').then(m=>m.IndividualInventoryReportsModule)
},
{
  path: 'spare-summary',
  loadChildren:() => import('./spare-summary/spare-report-summary.module').then(m=>m.SpareReportSummaryModule)
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndividualInventoryModuleRoutingModule { }
