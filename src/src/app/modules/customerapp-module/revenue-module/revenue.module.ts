import { JournalService } from './../reports-module/accountant-module/journal-entry-module/services/journal.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevenueRoutingModule } from './revenue-routing.module';
import { RevenueComponent } from './revenue.component';
import { InvoiceService } from '../api-services/revenue-module-service/invoice-service/invoice.service';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  declarations: [
    RevenueComponent,

  ],
  imports: [
    CommonModule,
    RevenueRoutingModule,
    NgxPermissionsModule.forChild()

  ],
  providers: [InvoiceService, JournalService],
  exports: [
    RevenueRoutingModule
  ]
})
export class RevenueModule {

}

