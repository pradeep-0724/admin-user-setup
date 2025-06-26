import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';

const routes: Routes = [
  {
    path: TSRouterLinks.add,
    canActivate: [NgxPermissionsGuard],
    loadChildren:()=>import('./coa-add-edit-module/coa-add-edit-module.module').then(m=>m.CoaAddEditModule),
    data: {
      permissions: {
        only:Permission.opening_balance.toString().split(',')[0],
      }
    }
  },
  {
    path: TSRouterLinks.list,
    canActivate: [NgxPermissionsGuard],
    loadChildren:() => import('./view-coa-module/view-coa-module.module').then(m=>m.ViewCoaModule),
    data: {
      permissions: {
        only:Permission.opening_balance.toString().split(',')[3],
      }
    }
  },
  {
    path: TSRouterLinks.master_chart_of_account_transaction + '/:account_id',
    canActivate: [NgxPermissionsGuard],
    loadChildren:() => import('./account-transaction-module/account-transaction-module.module').then(m=>m.AccountTransactionModule),
    data: {
      permissions: {
        only:Permission.opening_balance.toString().split(',')[3],
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChartOfAccountRoutingModule { }
