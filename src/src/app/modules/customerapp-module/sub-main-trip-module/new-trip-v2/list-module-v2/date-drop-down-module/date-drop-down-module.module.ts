import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import {MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { DateDropDownComponent } from './date-drop-down/date-drop-down.component';



@NgModule({
  declarations: [
    DateDropDownComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatMenuModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatNativeDateModule,
  ],
  exports:[DateDropDownComponent]
})
export class DateDropDownModule { }
 