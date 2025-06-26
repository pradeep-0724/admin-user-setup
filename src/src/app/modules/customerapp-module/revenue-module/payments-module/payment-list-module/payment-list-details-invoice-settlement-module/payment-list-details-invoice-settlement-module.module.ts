import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentListDetailsInvoiceSettlementModuleRoutingModule } from './payment-list-details-invoice-settlement-module-routing.module';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { DetailInvoiceSettelmentComponent } from './detail-invoice-settelment/detail-invoice-settelment.component';
import { InvoicePaymentListFilterPipe } from './invoice-payment-search.pipe';
import { InvoiceSettelmentComponent } from './invoice-settelment-component/invoice-settelment.component';
import { PaymentListRoutingModule } from '../payment-list.routing';
import { AddEmailPopupModule } from 'src/app/modules/customerapp-module/add-email-popup-module/add-email-popup-module.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { GoThroughModule } from 'src/app/modules/customerapp-module/go-through/go-through.module';
import { ListModuleV2 } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';


@NgModule({
  declarations: [ InvoicePaymentListFilterPipe,DetailInvoiceSettelmentComponent,InvoiceSettelmentComponent,],
  imports: [
    CommonModule,
    PaymentListDetailsInvoiceSettlementModuleRoutingModule,
    FormsModule,
    SharedModule,
    GoThroughModule,
    ListModuleV2,
    NgxPaginationModule,
    AddEmailPopupModule,
    PdfViewerModule,
    PaymentListRoutingModule,
    NgxPermissionsModule.forChild(),
    MatIconModule
  ]
})
export class PaymentListDetailsInvoiceSettlementModule { }
