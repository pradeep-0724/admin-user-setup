import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkOrderV2Component } from './work-order-v2/work-order-v2.component';


const routes: Routes = [
  {
    path:'',
    component:WorkOrderV2Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkOrderAddModueRoutingModule { }
