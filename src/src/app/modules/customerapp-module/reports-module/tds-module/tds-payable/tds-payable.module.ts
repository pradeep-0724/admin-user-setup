import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TdsPayableRoutingModule } from './tds-payable-routing.module';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { TdsPayableComponent } from './tds-payable.component';


@NgModule({
  declarations: [TdsPayableComponent],
  imports: [
    CommonModule,
    TdsPayableRoutingModule,
    BsDatepickerModule.forRoot(),
    FormsModule,
    SharedModule,
    NgxPaginationModule,
  ]
})
export class TdsPayableModule { }
