import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocalPurchaseOrderModuleRoutingModule } from './local-purchase-order-module-routing.module';
import { NgxPermissionsModule } from 'ngx-permissions';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    LocalPurchaseOrderModuleRoutingModule,
    NgxPermissionsModule.forChild(),
  
  ]
})
export class LocalPurchaseOrderModuleModule { }
