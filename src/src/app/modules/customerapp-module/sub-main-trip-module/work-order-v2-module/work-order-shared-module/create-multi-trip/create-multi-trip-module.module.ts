import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateMultiTripComponent } from './create-multi-trip.component';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { DialogModule } from '@angular/cdk/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';



@NgModule({
  declarations: [CreateMultiTripComponent],
  imports: [
    CommonModule,
    SharedModule,
    DialogModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,

  ],
  exports:[CreateMultiTripComponent]
})
export class CreateMultiTripModule{ }
