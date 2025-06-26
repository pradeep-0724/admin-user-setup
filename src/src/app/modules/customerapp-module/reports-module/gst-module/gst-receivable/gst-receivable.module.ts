import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GstReceivableRoutingModule } from './gst-receivable-routing.module';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { GstReceivableComponent } from './gst-receivable.component';


@NgModule({
  declarations: [GstReceivableComponent],
  imports: [
    CommonModule,
    GstReceivableRoutingModule,
    BsDatepickerModule.forRoot(),
    FormsModule,
    SharedModule,
    NgxPaginationModule,
  ]
})
export class GstReceivableModule { }
