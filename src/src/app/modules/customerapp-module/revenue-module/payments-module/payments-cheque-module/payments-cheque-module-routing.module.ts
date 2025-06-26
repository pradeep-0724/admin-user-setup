import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChequePaymentComponent } from './cheque-payment/cheque-payment.component';

const routes: Routes = [{
  path:'',
  component:ChequePaymentComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentsChequeModuleRoutingModule { }
