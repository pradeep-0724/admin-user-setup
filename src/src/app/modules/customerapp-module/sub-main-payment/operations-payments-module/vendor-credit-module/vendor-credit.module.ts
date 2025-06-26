import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorCreditRoutingModule } from './vendor-credit-routing.module';
import { ListVendorCreditComponent } from './list-vendor-credit/list-vendor-credit.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { VendorCreditsComponent } from './vendor-credit/vendor-credit.component';
import { InvoiceService } from '../../../api-services/revenue-module-service/invoice-service/invoice.service';
import { NgxPermissionsModule } from 'ngx-permissions';
import { TaxModuleModule } from 'src/app/tax-module/tax-module.module';
import { VendorCreditListFilterPipe } from './vendor-credit-search.pipe';
import { OperationsActivityService } from '../../../api-services/operation-module-service/operations-activity.service';
import { AddPartyPopupModule } from '../../../master-module/party-module/add-party-popup-module/add-party-popup-module.module';
import { AddNewCoaModule } from '../../../master-module/chart-of-account-module/add-new-coa-module/add-new-coa-module.module';
import { AddExpenseItemPopupModule } from '../../../add-expense-item-popup-module/add-expense-item-popup-module.module';
import { GoThroughModule } from '../../../go-through/go-through.module';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ListModuleV2 } from '../../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';

@NgModule({
	declarations: [
		ListVendorCreditComponent,
		VendorCreditsComponent,
		VendorCreditListFilterPipe
	],
	imports: [
		CommonModule,
		GoThroughModule,
		ListModuleV2,
		VendorCreditRoutingModule,
		ReactiveFormsModule,
		FormsModule,
		NgxPaginationModule,
		AddPartyPopupModule,
		MatDatepickerModule,
		MatFormFieldModule,
		MatInputModule,
		MatNativeDateModule,
		MatAutocompleteModule,
		SharedModule,
		MatMomentDateModule,
		NgxPermissionsModule.forChild(),
		TaxModuleModule,
		AddExpenseItemPopupModule,
		AddNewCoaModule
	],
	providers:[OperationsActivityService,InvoiceService ]
})
export class VendorCreditModule {}
