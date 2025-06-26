import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripDestinationDetailsComponent } from './trip-destination-details/trip-destination-details.component';
import { MatTabsModule } from '@angular/material/tabs';
import { AddEditTripTaskModule } from '../add-edit-view-trip-task/add-edit-trip-task-module.module';
import { ToolTipModule } from '../../tool-tip/tool-tip.module';



@NgModule({
  declarations: [
    TripDestinationDetailsComponent
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    ToolTipModule,
    AddEditTripTaskModule
  ],
  exports:[TripDestinationDetailsComponent]
})
export class TripDestinationDetailsModule { }
