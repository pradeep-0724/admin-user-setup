import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RefundPaymentComponent } from './refund-component/refund.component';

const routes: Routes = [
  {
    path: '',
    component: RefundPaymentComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRefundModuleRoutingModule { }
