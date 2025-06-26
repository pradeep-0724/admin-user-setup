import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { TripFuelExpensesComponent } from './trip-fuel-expenses.component';



@NgModule({
  declarations: [TripFuelExpensesComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    SharedModule,
  ],
  exports:[TripFuelExpensesComponent]
})
export class TripFuelExpenseModule { }
