import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TdsReceivableRoutingModule } from './tds-receivable-routing.module';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { TdsReceivableComponent } from './tds-receivable.component';


@NgModule({
  declarations: [TdsReceivableComponent],
  imports: [
    CommonModule,
    TdsReceivableRoutingModule,
    BsDatepickerModule.forRoot(),
    FormsModule,
    SharedModule,
    NgxPaginationModule,
  ]
})
export class TdsReceivableModule { }
