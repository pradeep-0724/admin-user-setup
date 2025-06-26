import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VatPayableRoutingModule } from './vat-payable-routing.module';
import { VatPayabaleComponent } from './vat-payabale.component';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared-module/shared.module';


@NgModule({
  declarations: [
    VatPayabaleComponent
  ],
  imports: [
    CommonModule,
    VatPayableRoutingModule,
    BsDatepickerModule.forRoot(),
    FormsModule,
    SharedModule,
    NgxPaginationModule,
  ]
})
export class VatPayableModule { }
