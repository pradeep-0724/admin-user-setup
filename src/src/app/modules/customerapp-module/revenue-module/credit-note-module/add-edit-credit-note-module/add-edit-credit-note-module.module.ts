import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditCreditNoteModuleRoutingModule } from './add-edit-credit-note-module-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { TaxModuleModule } from 'src/app/tax-module/tax-module.module';
import { AddEmailPopupModule } from '../../../add-email-popup-module/add-email-popup-module.module';
import { AddInvoiceModule } from '../../../add-invoice-module/add-invoice-module.module';
import { AddItemModule } from '../../../master-module/item-module/add-item-module/add-item-module.module';
import { AddPartyPopupModule } from '../../../master-module/party-module/add-party-popup-module/add-party-popup-module.module';
import { VideoPlayModule } from '../../../video-play-module/video-play-module.module';
import { AddAddressModule } from '../../add-address-module/add-address-module.module';
import { InvoiceTripChallanModule } from '../../invoice-trip-challan-module/invoice-trip-challan-module.module';
import { CreditNoteComponent } from './credit-note/cerdit-note.component';
import { GoThroughModule } from '../../../go-through/go-through.module';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';


@NgModule({
  declarations: [ CreditNoteComponent],
  imports: [
    CommonModule,
    GoThroughModule,
    AddEditCreditNoteModuleRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    SharedModule,
    MatSortModule,
    MatCheckboxModule,
    MatIconModule,
    AddInvoiceModule,
    AddPartyPopupModule,
    VideoPlayModule,
    AddEmailPopupModule,
    AddAddressModule,
    InvoiceTripChallanModule,
    AddItemModule,
    MatMomentDateModule,
    TaxModuleModule
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
})
export class AddEditCreditNoteModule { }
