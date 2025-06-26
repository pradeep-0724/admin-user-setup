import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListLocalPurchaseOrderRoutingModule } from './list-local-purchase-order-routing.module';
import { LocalPurchaseOrderListComponent } from './local-purchase-order-list/local-purchase-order-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared-module/shared.module';

import { ListModuleV2 } from '../../new-trip-v2/list-module-v2/list-module-v2.module';
import { NgxPermissionsModule } from 'ngx-permissions';


@NgModule({
  declarations: [
    LocalPurchaseOrderListComponent
  ],
  imports: [
    CommonModule,
    ListLocalPurchaseOrderRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    ListModuleV2,
    NgxPermissionsModule.forChild()
    
  ]
})
export class ListLocalPurchaseOrderModule { }
