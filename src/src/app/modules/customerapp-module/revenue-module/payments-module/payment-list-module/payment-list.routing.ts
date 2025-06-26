import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';


const routes: Routes = [
            {
                path: TSRouterLinks.revenue_invoice,
                canActivate: [NgxPermissionsGuard],
                loadChildren:() => import('./payment-list-details-invoice-settlement-module/payment-list-details-invoice-settlement-module.module').then(m=>m.PaymentListDetailsInvoiceSettlementModule),
                   data: {
                  permissions: {
                    only:Permission.payments__settlement.toString().split(',')[3],
                  }
               },
            },
             {
               path: TSRouterLinks.operations_payments_vendor_advance,
               canActivate: [NgxPermissionsGuard],
              loadChildren:() => import('./advance-payment-list-details-module/advance-payment-list-details-module.module').then(m=>m.AdvancePaymentListDetailsModule),
               data: {
              permissions: {
                only:Permission.payments__advance.toString().split(',')[3],
             }
           },
             },
             {
               path: TSRouterLinks.revenue_refund,
               canActivate: [NgxPermissionsGuard],
               loadChildren:() => import('./payement-list-refunds-module/payement-list-refunds-module.module').then(m=>m.PayementListRefundsModule),
               data: {
              permissions: {
                only:Permission.payments__refund.toString().split(',')[3],
             }
           },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PaymentListRoutingModule { }
