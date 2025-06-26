import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocalPurchaseOrderListComponent } from './local-purchase-order-list/local-purchase-order-list.component';

const routes: Routes = [{
  path:'',
  component:LocalPurchaseOrderListComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListLocalPurchaseOrderRoutingModule { }
