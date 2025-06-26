import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { PartyAdvanceComponent } from './party-advance.component';
import { DatepickerModule } from 'ngx-bootstrap';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter } from '@angular/material/core';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';



@NgModule({
  declarations: [PartyAdvanceComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    DatepickerModule,
    MatDatepickerModule,
    SharedModule,
    MatMomentDateModule,
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
  exports:[PartyAdvanceComponent]
})
export class PartyAdvanceModule { }
