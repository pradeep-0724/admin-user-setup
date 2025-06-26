import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkOrderListV2Component } from './work-order-list-v2/work-order-list-v2.component';

const routes: Routes = [{
  path:'',
  component:WorkOrderListV2Component,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkOrderListV2RoutingModule { }
