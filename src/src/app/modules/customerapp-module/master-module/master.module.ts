import { MasterComponent } from './master.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterRoutingModule } from './master-routing.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { InvoiceService } from '../api-services/revenue-module-service/invoice-service/invoice.service';
import { OperationsActivityService } from '../api-services/operation-module-service/operations-activity.service';



@NgModule({
  declarations: [
    MasterComponent,
  ],
  imports: [
    CommonModule,
    MasterRoutingModule,
    NgxPermissionsModule.forChild()
  ],
  exports: [
    MasterRoutingModule
  ],
  providers: [InvoiceService, OperationsActivityService],

})
export class MasterModule { }
