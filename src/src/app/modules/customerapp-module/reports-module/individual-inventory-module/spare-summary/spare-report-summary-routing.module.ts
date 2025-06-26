import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpareSummaryComponent } from './spare-summary.component';

const routes: Routes = [
  {
    path: '',
    component:SpareSummaryComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpareReportSummaryRoutingModule { }
