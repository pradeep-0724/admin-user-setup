import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEditEmployeeSalaryComponent } from './add-edit-employee-salary/add-edit-employee-salary.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { UserOnBoardingAuthGaurd } from 'src/app/core/services/user-onboarding-auth';
const routes: Routes = [{
  canActivate:[NgxPermissionsGuard,UserOnBoardingAuthGaurd],
  path:'add',
  component:AddEditEmployeeSalaryComponent,
  data: {
    permissions: {
      only: Permission.employee_salary.toString().split(',')[0],
    }
  }
},
{
  path:'edit/:editid',
  component:AddEditEmployeeSalaryComponent,
  canActivate:[NgxPermissionsGuard,UserOnBoardingAuthGaurd],
  data: {
    permissions: {
      only: Permission.employee_salary.toString().split(',')[1],

    }
  }
},
{
  path:'list',
  loadChildren:()=>import('./list-view-employee-salary/list-employee-salary.module').then(m=>m.ListEmployeeSalaryModule),
  canActivate:[NgxPermissionsGuard],
  data: {
    permissions: {
      only: Permission.employee_salary.toString().split(',')[3],

    }
  }
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeSalaryModuleRoutingModule { }
