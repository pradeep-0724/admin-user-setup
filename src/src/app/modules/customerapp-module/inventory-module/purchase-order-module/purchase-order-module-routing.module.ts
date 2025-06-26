import { PurchaseOrderListComponent } from './purchase-order-list/purchase-order-list.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from '../../../../core/constants/permissionConstants';
import { UserOnBoardingAuthGaurd } from 'src/app/core/services/user-onboarding-auth';


const routes: Routes = [{
  path:'add',
  component:PurchaseOrderComponent,
  canActivate:[NgxPermissionsGuard,UserOnBoardingAuthGaurd],
  data: {
    permissions: {
      only: Permission.purchase_order.toString().split(',')[0],
    }
  }
},
{
  path:'edit/:editid',
  component:PurchaseOrderComponent,
  canActivate:[NgxPermissionsGuard,UserOnBoardingAuthGaurd],
  data: {
    permissions: {
      only: Permission.purchase_order.toString().split(',')[1]
    }
  }
},
{
  path:'list',
  component:PurchaseOrderListComponent,
  canActivate:[NgxPermissionsGuard],
  data: {
    permissions: {
      only: Permission.purchase_order.toString().split(',')[3],
    }
  }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseOrderModuleRoutingModule { }
