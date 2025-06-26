import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { SelfFuelComponent } from './self-fuel.component';
import { AddPartyPopupModule } from 'src/app/modules/customerapp-module/master-module/party-module/add-party-popup-module/add-party-popup-module.module';
import { DateAdapter } from '@angular/material/core';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';



@NgModule({
  declarations: [SelfFuelComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    AddPartyPopupModule,
    SharedModule,
    MatMomentDateModule,
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
  exports:[SelfFuelComponent]
})
export class SelfFuelModule { }
