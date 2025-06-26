import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddInspectionTypePopup, InspectionTypeComponent } from './inspection-type/inspection-type.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    InspectionTypeComponent,AddInspectionTypePopup
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),

  ],
  exports:[InspectionTypeComponent]
})
export class InspectionTypeModule { }
