import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripChallanComponent } from './trip-challan/trip-challan.component';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { ToolTipModule } from '../../new-trip-v2/tool-tip/tool-tip.module';



@NgModule({
  declarations: [TripChallanComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    ToolTipModule
  ],
  exports:[TripChallanComponent]
})
export class AddTripChallanPopupModule { }
