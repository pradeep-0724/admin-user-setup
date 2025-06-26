import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentListRoutingModule } from './payment-list.routing';
import { NgxPermissionsModule } from 'ngx-permissions';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    PaymentListRoutingModule,
    NgxPermissionsModule.forChild(),

  ],
})
export class PaymentListModule { }
