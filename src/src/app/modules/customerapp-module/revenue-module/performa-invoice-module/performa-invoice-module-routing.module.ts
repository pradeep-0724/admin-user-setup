import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { UserOnBoardingAuthGaurd } from 'src/app/core/services/user-onboarding-auth';

const routes: Routes = [
  {
    path: TSRouterLinks.add,
    loadChildren:() => import('./add-edit-performa-invoice-module/add-edit-performa-invoice-module.module').then(m=>m.AddEditPerformaInvoiceModuleModule),
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
    data: {
      permissions: {
        only: Permission.invoice.toString().split(',')[0],
      }
    },
  },
  {
    path: TSRouterLinks.list,
    loadChildren:() => import('./list-view-performa-invoice-module/list-view-performa-invoice-module.module').then(m=>m.ListViewPerformaInvoiceModuleModule),
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: Permission.invoice.toString().split(',')[3],
      }
    },
  },
  {
    path: TSRouterLinks.list + '/:performa_invoice_id',
    loadChildren:() => import('./list-view-performa-invoice-module/list-view-performa-invoice-module.module').then(m=>m.ListViewPerformaInvoiceModuleModule),
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
    data: {
      permissions: {
        only: Permission.invoice.toString().split(',')[3],
      }
    },
  },
  {
    path: TSRouterLinks.edit + '/:performa_invoice_id',
    loadChildren:() => import('./add-edit-performa-invoice-module/add-edit-performa-invoice-module.module').then(m=>m.AddEditPerformaInvoiceModuleModule),
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
export class PerformaInvoiceModuleRoutingModule { }
