import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceSettelmentComponent } from './invoice-settelment-component/invoice-settelment.component';

const routes: Routes = [
  {
    path:'',
    component: InvoiceSettelmentComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentListDetailsInvoiceSettlementModuleRoutingModule { }
