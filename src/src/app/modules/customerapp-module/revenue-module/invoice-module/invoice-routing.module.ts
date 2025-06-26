import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { UserOnBoardingAuthGaurd } from 'src/app/core/services/user-onboarding-auth';

const routes: Routes = [
  {
    path: TSRouterLinks.add,
    loadChildren:() => import('./add-edit-invoice-module/add-edit-invoice-module.module').then(m=>m.AddEditInvoiceModule),
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
    data: {
      permissions: {
        only: Permission.invoice.toString().split(',')[0],
      }
    },
  },
  {
    path: TSRouterLinks.list,
    loadChildren:() => import('./invoice-list-view-module/invoice-list-view-module.module').then(m=>m.InvoiceListViewModule),
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: Permission.invoice.toString().split(',')[3],
      }
    },
  },
  {
    path: TSRouterLinks.list + '/:invoice_id',
    loadChildren:() => import('./invoice-list-view-module/invoice-list-view-module.module').then(m=>m.InvoiceListViewModule),
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
    data: {
      permissions: {
        only: Permission.invoice.toString().split(',')[3],
      }
    },
  },
  {
    path: TSRouterLinks.view+'/:invoice_id',
    loadChildren:() => import('./invoice-details-module/invoice-details-module.module').then(m=>m.InvoiceDetailsModuleModule),
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
    data: {
      permissions: {
        only: Permission.invoice.toString().split(',')[3],
      }
    },
  },
  {
    path: TSRouterLinks.edit + '/:invoice_id',
    loadChildren:() => import('./add-edit-invoice-module/add-edit-invoice-module.module').then(m=>m.AddEditInvoiceModule),
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
    data: {
      permissions: {
        only: Permission.invoice.toString().split(',')[1],
      }
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule { }
