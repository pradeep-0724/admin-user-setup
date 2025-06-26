import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomFieldComponent } from './custom-field/custom-field.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '../../../../../shared-module/shared.module';
import { RouterModule } from '@angular/router';
import { NgxPermissionsModule } from 'ngx-permissions';
import { DateAndTimeModule } from '../../../date-and-time-module/date-and-time-module.module';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';


@NgModule({
  declarations: [
    CustomFieldComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxMatDatetimePickerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatMomentModule,
    MatFormFieldModule,
    NgxMatTimepickerModule,
    MatInputModule,
    SharedModule,
    RouterModule,
    DateAndTimeModule,
    MatMomentDateModule,
    NgxPermissionsModule.forChild(),
    

  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
  exports:[CustomFieldComponent]
})
export class CustomFieldModule { }
