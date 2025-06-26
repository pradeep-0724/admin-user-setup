import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkOrderDetailsV2Component } from './work-order-details-v2/work-order-details-v2.component';
import { WorkorderToJobContainerComponent } from './workorder-to-job-container/workorder-to-job-container.component';

const routes: Routes = [
  {
    path:'assign-job',
    component:WorkorderToJobContainerComponent
  },
  {
    path:':work-order-id',
    component:WorkOrderDetailsV2Component
},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkOrderDetailsV2RoutingModule { }
