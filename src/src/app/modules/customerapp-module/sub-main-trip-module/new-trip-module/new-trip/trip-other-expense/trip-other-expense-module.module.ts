import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { TripOtherExpenseComponent } from './trip-other-expense.component';
import { AddNewCoaModule } from 'src/app/modules/customerapp-module/master-module/chart-of-account-module/add-new-coa-module/add-new-coa-module.module';
import { DateAdapter } from '@angular/material/core';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';



@NgModule({
  declarations: [TripOtherExpenseComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    AddNewCoaModule,
    SharedModule,
    MatMomentDateModule,
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
  exports:[TripOtherExpenseComponent]
})
export class TripOtherExpenseModule { }
