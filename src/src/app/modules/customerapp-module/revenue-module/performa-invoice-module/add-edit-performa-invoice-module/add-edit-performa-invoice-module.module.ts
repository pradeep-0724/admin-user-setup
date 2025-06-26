import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddEditPerformaInvoiceModuleRoutingModule } from './add-edit-performa-invoice-module-routing.module';
import { PerformaInvoiceComponent } from './performa-invoice/performa-invoice.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { TaxModuleModule } from 'src/app/tax-module/tax-module.module';
import { CustomFilterPaginationModule } from '../../../custom-filter-pagination-module/custom-filter-pagination-module.module';
import { GoThroughModule } from '../../../go-through/go-through.module';
import { AddItemModule } from '../../../master-module/item-module/add-item-module/add-item-module.module';
import { AddPartyPopupModule } from '../../../master-module/party-module/add-party-popup-module/add-party-popup-module.module';
import { AddTripChallanPopupModule } from '../../../sub-main-trip-module/new-trip-module/add-trip-challan-popup-module/add-trip-challan-popup-module.module';
import { AdvancesPopupModule } from '../../../sub-main-trip-module/new-trip-module/new-trip/advances-popup/advances-popup-module.module';
import { ChargesPopupModule } from '../../../sub-main-trip-module/new-trip-module/new-trip/charges-popup/charges-popup-module.module';
import { EditTripNewPopUpModule } from '../../../sub-main-trip-module/new-trip-module/new-trip/edit-trip-new-pop-up/edit-trip-new-pop-up-module.module';
import { VideoPlayModule } from '../../../video-play-module/video-play-module.module';
import { AddAddressModule } from '../../add-address-module/add-address-module.module';
import { AddDisclaimerPopupModule } from '../../add-disclaimer-popup-module/add-disclaimer-popup-module.module';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';


@NgModule({
  declarations: [
    PerformaInvoiceComponent
  ],
  imports: [
    CommonModule,
    AddEditPerformaInvoiceModuleRoutingModule,
    GoThroughModule,
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
    CustomFilterPaginationModule,
    AddDisclaimerPopupModule,
    AddAddressModule,
    ChargesPopupModule,
    AdvancesPopupModule,
    EditTripNewPopUpModule,
    AddTripChallanPopupModule,
    MatMomentDateModule,
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
})
export class AddEditPerformaInvoiceModuleModule { }
