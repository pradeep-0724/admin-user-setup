import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentStatusComponent } from './payment-status/payment-status.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateAdapter } from '@angular/material/core';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';



@NgModule({
  declarations: [
    PaymentStatusComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    MatDatepickerModule,
		MatFormFieldModule,
    MatFormFieldModule,
		MatInputModule,
    MatMomentDateModule
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
  exports:[PaymentStatusComponent]
})
export class PaymentModule{ }
