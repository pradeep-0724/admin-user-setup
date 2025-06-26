import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeDetailsV2Component } from './employee-details-v2/employee-details-v2.component';

const routes: Routes = [{
  path:'',
  component:EmployeeDetailsV2Component
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeDetailsV2RoutingModule { }
