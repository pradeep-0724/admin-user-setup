import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GstModuleRoutingModule } from './gst-module-routing.module';
import { GstService } from '../../api-services/reports-module-services/gst-service/gst.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    GstModuleRoutingModule,
  ],
  providers: [GstService]
})
export class GstModuleModule { }
