import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankAddEditModuleRoutingModule } from './bank-add-edit-module-routing.module';
import { BankComponent } from './bank/bank.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { GoThroughModule } from '../../../go-through/go-through.module';
import { DateAdapter } from '@angular/material/core';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';


@NgModule({
  declarations: [BankComponent],
  imports: [
    CommonModule,
    GoThroughModule,
    BankAddEditModuleRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    SharedModule,
    MatInputModule,
    AppErrorModuleModule,
    MatMomentDateModule,
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],

})
export class BankAddEditModule { }
