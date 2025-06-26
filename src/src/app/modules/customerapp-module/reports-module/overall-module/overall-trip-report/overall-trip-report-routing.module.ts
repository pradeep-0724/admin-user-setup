import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverallTripReportComponent } from './overall-trip-report/overall-trip-report.component';

const routes: Routes = [{
  path:'',
  component:OverallTripReportComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OverallTripReportRoutingModule { }
