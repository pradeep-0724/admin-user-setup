import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { PaymentHistoryListFilterPipe } from './payment-history-pipe/payment-history.pipe';
import { VendorAdvanceListComponent } from './vendor-advance-list/vendor-advance-list.component';
import { PaymentHistoryListRoutingModule } from './payment-history-list.routing';
import { VendorAdvanceListFilterPipe } from './payment-history-pipe/vendor-advance-search.pipe';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { DetailsVendorAdvanceComponent } from '../details-vendor-advance/details-vendor-advance.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { OperationsPaymentsBillsDetailsComponent } from './operations-payments-bills-details/operations-payments-bills-details.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { GoThroughModule } from '../../../go-through/go-through.module';
import { ListModuleV2 } from '../../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';

@NgModule({
	declarations: [
        PaymentHistoryComponent,
        VendorAdvanceListComponent,
        VendorAdvanceListFilterPipe,
        PaymentHistoryListFilterPipe,
        DetailsVendorAdvanceComponent,
        OperationsPaymentsBillsDetailsComponent,

	],
	imports: [
        FormsModule,
        CommonModule,
	      NgxPaginationModule,
        MatIconModule,
        PdfViewerModule,
        PaymentHistoryListRoutingModule,
        SharedModule,
        ListModuleV2,
        NgxPermissionsModule.forChild(),
        GoThroughModule
	]
})
export class PaymentHistoryListModule {}
