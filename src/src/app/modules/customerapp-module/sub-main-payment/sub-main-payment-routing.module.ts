import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { UserOnBoardingAuthGaurd } from 'src/app/core/services/user-onboarding-auth';
import { BillPaymentsComponent } from './operations-payments-module/bill-payments/bill-payments.component';
import { VendorAdvanceComponent } from './operations-payments-module/vendor-advance/vendor-advance.component';

const routes: Routes = [
  {
    path: TSRouterLinks.operations_payments_bill_payment,
    component: BillPaymentsComponent,
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
    data: {
      permissions: {
        only: Permission.bill_payment.toString().split(',')[0],
      }
    }
  },
  {
    path: TSRouterLinks.operations_payments_bill_payment_edit + '/:bill_payment_id',
    component: BillPaymentsComponent,
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
    data: {
      permissions: {
        only: Permission.bill_payment.toString().split(',')[1],
      }
    }
  },
  {
    path: TSRouterLinks.operations_payments_vendor_advance,
    component: VendorAdvanceComponent,
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
    data: {
      permissions: {
        only: Permission.vendor_advance.toString().split(',')[0],
      }
    }
  },
  {
    path: TSRouterLinks.operations_payments_vendor_advance_edit + '/:vendor_advance_id',
    component: VendorAdvanceComponent,
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
    data: {
      permissions: {
        only: Permission.vendor_advance.toString().split(',')[1],
      }
    }
  },
  {
    path: TSRouterLinks.operations_payments_payment_history,
    loadChildren: () => import('./operations-payments-module/payment-history-list-module/payment-history-list.module').then(m => m.PaymentHistoryListModule),
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        except:['no permission need here'],
      }
    }
  },
  {
    path:'vendor_credit',
    loadChildren: () => import('./operations-payments-module/vendor-credit-module/vendor-credit.module').then(m => m.VendorCreditModule),
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: Permission.vendor_credit.toString().split(','),
      }
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubMainPaymentRoutingModule { }
