import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseOrderModuleRoutingModule } from './purchase-order-module-routing.module';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { PurchaseOrderListComponent } from './purchase-order-list/purchase-order-list.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PurchaseOrderPipePipe } from './purchase-order-pipe.pipe';
import { ChangeStatusPurchaseOrderComponent } from './change-status-purchase-order/change-status-purchase-order.component';
import { PurchaseOrderDetailsComponent } from './purchase-order-details/purchase-order-details.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { OperationsActivityService } from '../../api-services/operation-module-service/operations-activity.service';
import { InvoiceService } from '../../api-services/revenue-module-service/invoice-service/invoice.service';
import { AddPartyPopupModule } from '../../master-module/party-module/add-party-popup-module/add-party-popup-module.module';
import { AddExpenseItemPopupModule } from '../../add-expense-item-popup-module/add-expense-item-popup-module.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ListWidgetModule } from 'src/app/shared-module/list-widget-module/list-widget-module.module';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
@NgModule({
  declarations: [PurchaseOrderComponent, PurchaseOrderListComponent, PurchaseOrderPipePipe, ChangeStatusPurchaseOrderComponent, PurchaseOrderDetailsComponent],
  imports: [
    CommonModule,
    PurchaseOrderModuleRoutingModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    AddPartyPopupModule,
    MatRadioModule,
    AddExpenseItemPopupModule,
    SharedModule,
    FormsModule,
    PdfViewerModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MatMomentDateModule,
    ListWidgetModule,
    NgxPermissionsModule.forChild(),
  ],
  providers:[OperationsActivityService,InvoiceService , { provide: DateAdapter, useClass: AppDateAdapter }]
})
export class PurchaseOrderModuleModule { }
