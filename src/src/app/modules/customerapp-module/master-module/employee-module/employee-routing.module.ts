import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';

const routes: Routes = [
  // {
  //   path: TSRouterLinks.master_employee_add,
  //   canActivate: [NgxPermissionsGuard],
  //   loadChildren: () => import('./../employee-module/edit-employee-module/edit-employee.module').then(m => m.EditEmployeeModule),
  //   data: {
  //     permissions: {
  //       only: Permission.employee.toString().split(',')[0]
  //     }
  //   }
  // },
  {
    path: TSRouterLinks.master_employee_add,
    canActivate: [NgxPermissionsGuard],
    loadChildren: () => import('./add-edit-employee-v2/add-edit-employee-v2.module').then(m => m.AddEditEmployeeV2Module),
    data: {
      permissions: {
        only: Permission.employee.toString().split(',')[0]
      }
    }
  },



  {
    path: TSRouterLinks.master_edit +'/:id' ,
    loadChildren: () => import('./add-edit-employee-v2/add-edit-employee-v2.module').then(m => m.AddEditEmployeeV2Module),
    data: {
      permissions: {
        only: Permission.employee.toString().split(',')[1]
      }
    }
  },
  {
    path: TSRouterLinks.master_employee_view,
    loadChildren:() => import('./employee-view-details-module/employee-view-details-module.module').then(m=>m.EmployeeViewDetailsModule),
    data: {
      permissions: {
        only: Permission.employee.toString().split(',')[3]
      }
    }
  },
  {
    path: TSRouterLinks.master_employee_view + '/:employee_id',
    loadChildren:() => import('./employee-view-details-module/employee-view-details-module.module').then(m=>m.EmployeeViewDetailsModule),
    data: {
      permissions: {
        only: Permission.employee.toString().split(',')[3]
      }
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
