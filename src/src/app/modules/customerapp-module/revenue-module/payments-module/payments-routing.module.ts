import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { UserOnBoardingAuthGaurd } from 'src/app/core/services/user-onboarding-auth';


const routes: Routes = [
  {
    path: TSRouterLinks.revenue_payments_invoice_add,
    loadChildren:() => import('./payment-invoice-module/payment-invoice-module.module').then(m=>m.PaymentInvoiceModule),
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
    data: {
      permissions: {
        only: Permission.payments__settlement.toString().split(',')[0],
      }
    },
  },
  {
    path: TSRouterLinks.revenue_invoice_list,
    canActivate: [NgxPermissionsGuard],
    loadChildren: () => import('./../payments-module/payment-list-module/payment-list.module').then(m => m.PaymentListModule),
    data: {
      permissions: {
        expect: ["no permission here"]
      }
    },
  },
  {
    path: TSRouterLinks.revenue_invoice_cheque_payment,
    loadChildren:() => import('./payments-cheque-module/payments-cheque-module.module').then(m =>m.PaymentsChequeModule),
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:Permission.payments__settlement.toString().split(',')[3],
      }
    },
  },
  {
    path: TSRouterLinks.revenue_payments_refund_add,
    loadChildren: () => import('./payment-refund-module/payment-refund-module.module').then(m=>m.PaymentRefundModule),
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
    data: {
      permissions: {
        only: Permission.payments__refund.toString().split(',')[0],

      }
    },
  },
  {
    path: TSRouterLinks.revenue_payments_advance_add,
    loadChildren:() => import('./payment-advance-module/payment-advance-module.module').then(m =>m.PaymentAdvanceModule),
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
    data: {
      permissions: {
        only: Permission.payments__advance.toString().split(',')[0],

      }
    },
  },
  {
    path: TSRouterLinks.revenue_payments_advance_edit + '/:advance_id',
    loadChildren:() => import('./payment-advance-module/payment-advance-module.module').then(m =>m.PaymentAdvanceModule),
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
    data: {
      permissions: {
        only: Permission.payments__advance.toString().split(',')[1],
      }
    },
  },
  {
    path: TSRouterLinks.revenue_payments_invoice_edit + '/:invoice_id',
    loadChildren:() => import('./payment-invoice-module/payment-invoice-module.module').then(m=>m.PaymentInvoiceModule),
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
    data: {
      permissions: {
        only: Permission.payments__settlement.toString().split(',')[1],

      }
    },
  },
  {
    path: TSRouterLinks.revenue_payments_refund_edit + '/:refund_id',
    loadChildren: () => import('./payment-refund-module/payment-refund-module.module').then(m=>m.PaymentRefundModule),
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
    data: {
      permissions: {
        only: Permission.payments__advance.toString().split(',')[1],
      }
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentsRoutingModule { }
