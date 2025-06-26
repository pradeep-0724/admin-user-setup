import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillingTypesModule } from '../billing-types-module/billing-types-module.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { EditTripFreightComponent } from './edit-trip-freight.component';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { DateAdapter } from '@angular/material/core';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';



@NgModule({
  declarations: [EditTripFreightComponent],
  imports: [
    CommonModule,
    BillingTypesModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    SharedModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    MatMomentDateModule,
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
  exports:[EditTripFreightComponent]
})
export class EditTripFreightModule{ }
