import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RevenueComponent } from './revenue.component';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from './../../../core/constants/permissionConstants';

const routes: Routes = [
  {
    path: '',
    component: RevenueComponent,
    canActivateChild: [NgxPermissionsGuard],
    children: [

      {
        path: TSRouterLinks.revenue_performa_invoice,
        loadChildren: () => import('./performa-invoice-module/performa-invoice-module.module').then(m => m.PerformaInvoiceModuleModule),
        data: {
          permissions: {
            only: Permission.invoice.toString().split(','),
          }
        },
      },

      {
        path: TSRouterLinks.revenue_invoice,
        loadChildren: () => import('./invoice-module/invoice.module').then(m => m.InvoiceModule),
        data: {
          permissions: {
            only: Permission.invoice.toString().split(','),
          }
        },
      },
      {
        path: TSRouterLinks.revenue_debit_note,
        loadChildren: () => import('./debit-note-module/debit-note.module').then(m => m.DebitNoteModule),
        data: {
          permissions: {
            only: Permission.debit_note.toString().split(','),
          }
        },
      },
      {
        path: TSRouterLinks.revenue_credit_note,
        loadChildren: () => import('./credit-note-module/credit-note.module').then(m => m.CreditNoteModule),
        data: {
          permissions: {
            only: Permission.credit_note.toString().split(','),
          }
        },
      },
      {
        path: TSRouterLinks.revenue_payments,
        loadChildren: () => import('./payments-module/payments.module').then(m => m.PaymentsModule),
        data: {
          permissions: {
            only: Permission.incomePayment.toString().split(','),
          }
        },
      },
      {
        path: TSRouterLinks.revenue_bill_of_supply,
        loadChildren: () => import('./bill-of-supply-module/bill-of-supply.module').then(m => m.BillOfSupplyModule),
        data: {
          permissions: {
            only: Permission.bos.toString().split(','),
          }
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RevenueRoutingModule { }
