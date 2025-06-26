import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddBankActivityModuleRoutingModule } from './add-bank-activity-module-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { BankActivityComponent } from './bank-activity.component';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';


@NgModule({
  declarations: [BankActivityComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    SharedModule,
    MatMomentDateModule,
    AddBankActivityModuleRoutingModule
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
})
export class AddBankActivityModule { }
