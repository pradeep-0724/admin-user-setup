import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { UserOnBoardingAuthGaurd } from 'src/app/core/services/user-onboarding-auth';

const routes: Routes = [
  {
    path:TSRouterLinks.add,
    loadChildren:() => import('./add-edit-local-purchase-order/add-edit-local-purchase-order.module').then(m=>m.AddEditLocalPurchaseOrderModule),
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
    data: {
      permissions: {
        only: Permission.localPurchaseOrder.toString().split(',')[0],
      }
    },

},
{
  path:TSRouterLinks.edit,
  loadChildren:() => import('./add-edit-local-purchase-order/add-edit-local-purchase-order.module').then(m=>m.AddEditLocalPurchaseOrderModule),
  canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
  data: {
    permissions: {
      only: Permission.localPurchaseOrder.toString().split(',')[1],
    }
  },

},
{
  path:TSRouterLinks.list,
  loadChildren:() => import('./list-local-purchase-order/list-local-purchase-order.module').then(m=>m.ListLocalPurchaseOrderModule),
  canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
  data: {
    permissions: {
      only: Permission.localPurchaseOrder.toString().split(',')[3],
    },
  },
},
{
  path:TSRouterLinks.view+'/:id',
  loadChildren:() => import('./view-local-purchase-order/view-local-purchase-order.module').then(m=>m.ViewLocalPurchaseOrderModule),
  canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
  data: {
    permissions: {
      only: Permission.localPurchaseOrder.toString().split(',')[3],
    }
  },
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocalPurchaseOrderModuleRoutingModule { }
