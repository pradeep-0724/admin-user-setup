import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddNewChartOfAccountComponent } from './add-new-chart-of-account/add-new-chart-of-account.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { MaterialDropDownModule } from '../../../material-drop-down-module/material-drop-down-module.module';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';



@NgModule({
  declarations: [AddNewChartOfAccountComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatFormFieldModule,
    SharedModule,
    MatNativeDateModule,
    AppErrorModuleModule,
    MaterialDropDownModule,
    MatMomentDateModule
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
  exports:[AddNewChartOfAccountComponent]
})
export class AddNewCoaModule { }
