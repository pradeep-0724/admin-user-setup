import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocalPurchaseOrderComponent } from './local-purchase-order/local-purchase-order.component';

const routes: Routes = [
  {
    path:'',
    component:LocalPurchaseOrderComponent
  },
  {
    path:':lpo_id',
    component:LocalPurchaseOrderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddEditLocalPurchaseOrderRoutingModule { }
