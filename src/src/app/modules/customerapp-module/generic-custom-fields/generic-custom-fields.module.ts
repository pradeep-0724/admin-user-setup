import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericCustomFieldsComponent } from './generic-custom-fields/generic-custom-fields.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { RouterModule } from '@angular/router';
import { DateAndTimeModule } from '../date-and-time-module/date-and-time-module.module';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { NgxPermissionsModule } from 'ngx-permissions';



@NgModule({
  declarations: [
    GenericCustomFieldsComponent
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
  exports : [GenericCustomFieldsComponent]
})
export class GenericCustomFieldsModule { }
