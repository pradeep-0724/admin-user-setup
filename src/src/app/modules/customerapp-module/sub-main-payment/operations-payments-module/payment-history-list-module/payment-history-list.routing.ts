import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { VendorAdvanceListComponent } from './vendor-advance-list/vendor-advance-list.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';

const routes: Routes = [
	{
    path: TSRouterLinks.operations_payments_bill_payment,
    component: PaymentHistoryComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: Permission.bill_payment.toString().split(',')[3],
      }
    }
  },
  {
    path: TSRouterLinks.operations_payments_vendor_advance,
    component: VendorAdvanceListComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: Permission.vendor_advance.toString().split(',')[3],
      }
    }
  }
];

@NgModule({
	imports: [
		RouterModule.forChild(routes)
	],
	exports: [
		RouterModule
	]
})
export class PaymentHistoryListRoutingModule {}
