import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditDebitNoteModuleRoutingModule } from './add-edit-debit-note-module-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { TaxModuleModule } from 'src/app/tax-module/tax-module.module';
import { AddInvoiceModule } from '../../../add-invoice-module/add-invoice-module.module';
import { AddItemModule } from '../../../master-module/item-module/add-item-module/add-item-module.module';
import { AddPartyPopupModule } from '../../../master-module/party-module/add-party-popup-module/add-party-popup-module.module';
import { AddAddressModule } from '../../add-address-module/add-address-module.module';
import { DebitNoteComponent } from './debit-note/debit-note.component';
import { InvoiceTripChallanModule } from '../../invoice-trip-challan-module/invoice-trip-challan-module.module';
import { GoThroughModule } from '../../../go-through/go-through.module';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { CreditLimitModule } from '../../../credit-limit-module/credit-limit-module.module';


@NgModule({
  declarations: [DebitNoteComponent],
  imports: [
    CommonModule,
    GoThroughModule,
    AddEditDebitNoteModuleRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    SharedModule,
    MatIconModule,
    AddPartyPopupModule,
    AddItemModule,
    AddInvoiceModule,
    InvoiceTripChallanModule,
    AddAddressModule,
    MatMomentDateModule,
    TaxModuleModule,
    CreditLimitModule
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
})
export class AddEditDebitNoteModule{ }
