import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateAndTimePickerComponent } from './date-and-time-picker/date-and-time-picker.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMatDateAdapter, NgxMatDatetimePickerModule } from '@angular-material-components/datetime-picker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAndTimeFormat } from './date-and-time.pipe';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular-material-components/moment-adapter';



@NgModule({
  declarations: [
    DateAndTimePickerComponent,
    DateAndTimeFormat
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxMatDatetimePickerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule, 
    AppErrorModuleModule,
    MatMomentDateModule
  ],
  providers: [
    {
      provide: NgxMatDateAdapter,
      useClass: AppDateAdapter,
      deps: [MAT_DATE_LOCALE, NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    }
  ],
  
  exports:[DateAndTimePickerComponent]
})
export class DateAndTimeModule { }
