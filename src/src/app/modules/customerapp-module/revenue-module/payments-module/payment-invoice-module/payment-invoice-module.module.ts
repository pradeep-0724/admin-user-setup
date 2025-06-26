import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentInvoiceModuleRoutingModule } from './payment-invoice-module-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { TaxModuleModule } from 'src/app/tax-module/tax-module.module';
import { AddPartyPopupModule } from '../../../master-module/party-module/add-party-popup-module/add-party-popup-module.module';
import { InvoicePaymentComponent } from './invoice-settelment.component/invoice-settelment.component';
import { AddInvocieListFilterPipe } from './add-invoice-search.pipe';
import { AddDebitListFilterPipe } from './add-debit-search.pipe';
import { InvoiceCreditListFilterPipe } from './invoice-credit-list-search.pipe';
import { BosSearchListFilter } from './invoice-settlement-class/bos-search.pipe';
import { GoThroughModule } from '../../../go-through/go-through.module';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';


@NgModule({
  declarations: [InvoicePaymentComponent, AddInvocieListFilterPipe ,AddDebitListFilterPipe, InvoiceCreditListFilterPipe, BosSearchListFilter ],
  imports: [
    CommonModule,
    GoThroughModule,
    PaymentInvoiceModuleRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    SharedModule,
    AddPartyPopupModule,
    MatIconModule,
    MatMomentDateModule,
    TaxModuleModule
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
})
export class PaymentInvoiceModule { }
