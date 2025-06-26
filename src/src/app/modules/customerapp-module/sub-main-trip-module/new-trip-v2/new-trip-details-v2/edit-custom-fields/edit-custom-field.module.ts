import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditCustomFieldsComponent } from './edit-custom-fields.component';
import { NgxMatDatetimePickerModule } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { RouterModule } from '@angular/router';
import { DateAndTimeModule } from 'src/app/modules/customerapp-module/date-and-time-module/date-and-time-module.module';
import { DateAdapter } from '@angular/material/core';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';



@NgModule({
  declarations: [EditCustomFieldsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    SharedModule,
    RouterModule,
    NgxPermissionsModule,
    NgxMatDatetimePickerModule,
    NgxMatMomentModule,
    MatMomentDateModule,
    DateAndTimeModule
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
  exports:[EditCustomFieldsComponent]
})
export class EditCustomFieldModule { }
