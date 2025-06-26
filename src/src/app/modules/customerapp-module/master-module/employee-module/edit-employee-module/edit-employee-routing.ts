import { TSRouterLinks } from './../../../../../core/constants/router.constants';
import { EditEmployeeComponent } from './edit-employee.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';
const routes: Routes = [
  {
    path: '',
    component: EditEmployeeComponent,
    canActivateChild:[NgxPermissionsGuard],
    children: [
      {
        path: TSRouterLinks.master_employee_edit_information,
        loadChildren:() => import('./add-edit-information-module/add-edit-information-module.module').then(m=>m.AddEditInformationModule),
        data: {
          permissions: {
            only: Permission.employee.toString().split(',')
          }
        }
      },
      {
        path: TSRouterLinks.master_employee_edit_address,
        loadChildren:()=> import('./add-edit-address-module/add-edit-address-module.module').then(m=>m.AddEditAddressModule),
        data: {
          permissions: {
            only: Permission.employee.toString().split(','),
          }
        }
      },
      {
        path: TSRouterLinks.master_employee_add_address + '/:employee_id',
        loadChildren:()=> import('./add-edit-address-module/add-edit-address-module.module').then(m=>m.AddEditAddressModule),
        data: {
					permissions: {
						only:Permission.employee.toString().split(','),
					}
        }
      },
      {
        path: TSRouterLinks.master_employee_edit_document,
        loadChildren:() => import('./add-edit-document-module/add-edit-document-module.module').then(m=>m.AddEditDocumentModule),
        data: {
          permissions: {
            only: Permission.employee.toString().split(','),
          }
        }
      },
      {
        path: TSRouterLinks.master_employee_add_document + '/:employee_id',
        loadChildren:() => import('./add-edit-document-module/add-edit-document-module.module').then(m=>m.AddEditDocumentModule),
        data: {
					permissions: {
						only:Permission.employee.toString().split(','),
					}
        }
      },
      {
        path:TSRouterLinks.master_bank,
        loadChildren:()=>import('./add-edit-employee-bank-module/add-edit-employee-bank-module.module').then(m=>m.AddEditEmployeeBankModule),
        data: {
					permissions: {
						only:Permission.employee.toString().split(',')
					}
        }
      },
      {
        path:TSRouterLinks.master_bank+'/:employee_id',
        loadChildren:()=>import('./add-edit-employee-bank-module/add-edit-employee-bank-module.module').then(m=>m.AddEditEmployeeBankModule),
        data: {
					permissions: {
						only:Permission.employee.toString().split(','),
					}
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditEmployeeRoutingModule { }
