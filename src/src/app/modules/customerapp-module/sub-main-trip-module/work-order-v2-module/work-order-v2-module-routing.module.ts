import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { UserOnBoardingAuthGaurd } from 'src/app/core/services/user-onboarding-auth';

const routes: Routes = [
  {
    path: TSRouterLinks.add,
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
    loadChildren:()=> import('./work-order-add-modue/work-order-add-modue.module').then(m=>m.WorkOrderAddModue),
    data: {
      permissions: {
        only: Permission.workorder.toString().split(',')[0],
      }
    },
  },
  {
    path: TSRouterLinks.edit+'/:work_order_id',
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
    loadChildren:()=> import('./work-order-add-modue/work-order-add-modue.module').then(m=>m.WorkOrderAddModue),
    data: {
      permissions: {
        only: Permission.workorder.toString().split(',')[1],
      }
    },
  },
  {
    path: TSRouterLinks.list,
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
    loadChildren:()=> import('./work-order-list-v2/work-order-list-v2.module').then(m=>m.WorkOrderListV2Module),
    data: {
      permissions: {
        only: Permission.workorder.toString().split(',')[3],
      }
    }
  },
  {
    path: TSRouterLinks.details,
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
    loadChildren:()=> import('./work-order-details-v2/work-order-details-v2.module').then(m=>m.WorkOrderDetailsV2Module),
    data: {
      permissions: {
        only: Permission.workorder.toString().split(',')[3],
      }
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkOrderV2ModuleRoutingModule { }
