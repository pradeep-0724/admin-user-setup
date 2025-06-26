import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditEmployeeV2Component } from './add-edit-employee-v2/add-edit-employee-v2.component';


const routes: Routes=[
  {
    path: '',
    component: AddEditEmployeeV2Component,
  },
  {
    path:':employee_id',
    component:AddEditEmployeeV2Component
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddEditEmployeeV2RoutingModule { }
