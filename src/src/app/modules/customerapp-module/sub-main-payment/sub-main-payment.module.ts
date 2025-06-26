import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubMainPaymentRoutingModule } from './sub-main-payment-routing.module';
import { BillPaymentsComponent } from './operations-payments-module/bill-payments/bill-payments.component';
import { VendorAdvanceComponent } from './operations-payments-module/vendor-advance/vendor-advance.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { TaxModuleModule } from 'src/app/tax-module/tax-module.module';
import { AddPartyPopupModule } from '../master-module/party-module/add-party-popup-module/add-party-popup-module.module';
import { GoThroughModule } from '../go-through/go-through.module';


@NgModule({
  declarations: [
    BillPaymentsComponent,
		VendorAdvanceComponent
  ],
  imports: [
    CommonModule,
	GoThroughModule,
    SubMainPaymentRoutingModule,
    ReactiveFormsModule,
		FormsModule,
		MatDatepickerModule,
		MatFormFieldModule,
		MatInputModule,
		MatNativeDateModule,
		AddPartyPopupModule,
		MatAutocompleteModule,
		SharedModule,
		NgxPermissionsModule.forChild(),
    TaxModuleModule
  ]
})
export class SubMainPaymentModule { }
