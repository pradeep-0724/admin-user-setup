import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocalPurchaseOrderViewComponent } from './local-purchase-order-view/local-purchase-order-view.component';

const routes: Routes = [{
  path:'',
  component:LocalPurchaseOrderViewComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewLocalPurchaseOrderRoutingModule { }
