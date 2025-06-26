import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkOrderTenureStatusComponent } from './work-order-tenure-status/work-order-tenure-status.component';



@NgModule({
  declarations: [
    WorkOrderTenureStatusComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[WorkOrderTenureStatusComponent]
})
export class WorkOrderTenureStatusModule { }
