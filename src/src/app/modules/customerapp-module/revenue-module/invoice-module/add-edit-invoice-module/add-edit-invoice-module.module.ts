import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditInvoiceModuleRoutingModule } from './add-edit-invoice-module-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DateAdapter, MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { TaxModuleModule } from 'src/app/tax-module/tax-module.module';
import { AddItemModule } from '../../../master-module/item-module/add-item-module/add-item-module.module';
import { AddPartyPopupModule } from '../../../master-module/party-module/add-party-popup-module/add-party-popup-module.module';
import { VideoPlayModule } from '../../../video-play-module/video-play-module.module';
import { AddAddressModule } from '../../add-address-module/add-address-module.module';
import { AddChallanPopupModule } from '../../add-challan-popup-module/add-challan-popup-module.module';
import { AddDisclaimerPopupModule } from '../../add-disclaimer-popup-module/add-disclaimer-popup-module.module';
import { AddTripChallanPopupModule } from '../../../sub-main-trip-module/new-trip-module/add-trip-challan-popup-module/add-trip-challan-popup-module.module';
import { InvoiceComponent } from './invoice/invoice.component';
import { AdvancesPopupModule } from '../../../sub-main-trip-module/new-trip-module/new-trip/advances-popup/advances-popup-module.module';
import { ChargesPopupModule } from '../../../sub-main-trip-module/new-trip-module/new-trip/charges-popup/charges-popup-module.module';
import { EditTripNewPopUpModule } from '../../../sub-main-trip-module/new-trip-module/new-trip/edit-trip-new-pop-up/edit-trip-new-pop-up-module.module';
import { GoThroughModule } from '../../../go-through/go-through.module';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { CreditLimitModule } from '../../../credit-limit-module/credit-limit-module.module';
import { ToolTipModule } from '../../../sub-main-trip-module/new-trip-v2/tool-tip/tool-tip.module';
import {  MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DialogModule } from '@angular/cdk/dialog';
import { DateFormaterModule } from '../../../date-formater/date-formater.module';
import { InvoiceV2Component } from './invoice-v2/invoice-v2.component';
import { InvoiceCustomFieldComponent } from './invoice-custom-field/invoice-custom-field.component';


@NgModule({
  declarations: [InvoiceComponent, InvoiceV2Component, InvoiceCustomFieldComponent],
  imports: [
    CommonModule,
    GoThroughModule,
    AddEditInvoiceModuleRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    SharedModule,
    MatCheckboxModule,
    AddPartyPopupModule,
    VideoPlayModule,
    TaxModuleModule,
    AddItemModule,
    AddChallanPopupModule,
    AddDisclaimerPopupModule,
    AddAddressModule,
    ChargesPopupModule,
    AdvancesPopupModule,
    EditTripNewPopUpModule,
    AddTripChallanPopupModule,
    MatMomentDateModule,
    CreditLimitModule,
    ToolTipModule,
    MatTooltipModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    DialogModule,
    MatRippleModule,
    DateFormaterModule

  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
})
export class AddEditInvoiceModule{ }
