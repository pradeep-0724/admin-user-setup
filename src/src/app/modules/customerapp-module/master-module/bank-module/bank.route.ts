import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';


const routes: Routes = [
  {
    path: TSRouterLinks.add,
    canActivate: [NgxPermissionsGuard],
    loadChildren:()=> import('./bank-add-edit-module/bank-add-edit-module.module').then(m=>m.BankAddEditModule),
    data: {
      permissions: {
        only:Permission.bank.toString().split(',')[0],
      }
    }
  },
  {
    path: TSRouterLinks.edit,
    canActivate: [NgxPermissionsGuard],
    loadChildren:()=> import('./bank-add-edit-module/bank-add-edit-module.module').then(m=>m.BankAddEditModule),
    data: {
      permissions: {
        only:Permission.bank.toString().split(',')[1],
      }
    }
  },
  {
    path: TSRouterLinks.list,
    canActivate: [NgxPermissionsGuard],
    loadChildren:() => import('./bank-list-module/bank-list-module.module').then(m=>m.BankListModule),
    data: {
      permissions: {
        only:Permission.bank.toString().split(',')[3],
      }
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankRoutingModule { }
