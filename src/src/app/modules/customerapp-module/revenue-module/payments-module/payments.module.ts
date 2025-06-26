import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentsRoutingModule } from './payments-routing.module';
import { NgxPermissionsModule } from 'ngx-permissions';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PaymentsRoutingModule,
    NgxPermissionsModule.forChild(),

  ]
})
export class PaymentsModule { }
