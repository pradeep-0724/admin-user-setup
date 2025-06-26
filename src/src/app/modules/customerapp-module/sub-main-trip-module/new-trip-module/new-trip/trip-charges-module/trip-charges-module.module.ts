import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { TripAddToBillComponent } from './trip-add-to-bill/trip-add-to-bill.component';
import { TripReduceToBillComponent } from './trip-reduce-to-bill/trip-reduce-to-bill.component';
import { AddPartyPopupModule } from 'src/app/modules/customerapp-module/master-module/party-module/add-party-popup-module/add-party-popup-module.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AddNewCoaModule } from 'src/app/modules/customerapp-module/master-module/chart-of-account-module/add-new-coa-module/add-new-coa-module.module';
import { DateAdapter } from '@angular/material/core';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatRadioModule } from '@angular/material/radio';



@NgModule({
  declarations: [ TripAddToBillComponent, TripReduceToBillComponent,],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AddPartyPopupModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    SharedModule,
    AddNewCoaModule,
    MatMomentDateModule,
    MatRadioModule
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
  exports:[ TripAddToBillComponent, TripReduceToBillComponent,]
})
export class TripChargesModule{ }
