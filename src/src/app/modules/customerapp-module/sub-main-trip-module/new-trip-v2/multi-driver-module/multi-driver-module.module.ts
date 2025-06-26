import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiDriverSelectComponent } from './multi-driver-select/multi-driver-select.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
  declarations: [
    MultiDriverSelectComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatTooltipModule
  ],
  exports:[MultiDriverSelectComponent]
})
export class MultiDriverModule{ }
