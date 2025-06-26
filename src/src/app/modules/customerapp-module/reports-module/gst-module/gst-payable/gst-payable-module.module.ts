import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GstPayableModuleRoutingModule } from './gst-payable-module-routing.module';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { GstPayableComponent } from './gst-payable.component';


@NgModule({
  declarations: [GstPayableComponent],
  imports: [
    CommonModule,
    GstPayableModuleRoutingModule,
    BsDatepickerModule.forRoot(),
    FormsModule,
    SharedModule,
    NgxPaginationModule,

  ]
})
export class GstPayableModule { }
