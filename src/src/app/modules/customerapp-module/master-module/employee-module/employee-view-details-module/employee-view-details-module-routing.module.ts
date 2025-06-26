import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewEmployeeComponent } from './view-employee/view-employee.component';

const routes: Routes = [
  {
    path:'',
    component: ViewEmployeeComponent,

  },
  {
    path:':employee_id',
    loadChildren:()=> import('./employee-details-v2/employee-details-v2.module').then(m=>m.EmployeeDetailsV2Module)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeViewDetailsModuleRoutingModule { }
