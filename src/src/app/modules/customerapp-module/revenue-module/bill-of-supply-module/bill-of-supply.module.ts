import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillOfSupplyRoutingModule } from './bill-of-supply-routing.module';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BillOfSupplyRoutingModule,
    NgxPermissionsModule.forChild(),
  ]
})
export class BillOfSupplyModule { }
