import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoicePaymentComponent } from './invoice-settelment.component/invoice-settelment.component';

const routes: Routes = [

  {
    path: '',
    component: InvoicePaymentComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentInvoiceModuleRoutingModule { }
