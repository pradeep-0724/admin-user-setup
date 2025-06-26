import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditBankActivityModuleRoutingModule } from './edit-bank-activity-module-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { EditBankActivityComponent } from './edit-bank-activity.component';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';


@NgModule({
  declarations: [EditBankActivityComponent],
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
    EditBankActivityModuleRoutingModule
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
})
export class EditBankActivityModule { }
