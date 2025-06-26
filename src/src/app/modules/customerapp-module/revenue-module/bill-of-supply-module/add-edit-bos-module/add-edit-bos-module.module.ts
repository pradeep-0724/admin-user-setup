import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditBosModuleRoutingModule } from './add-edit-bos-module-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { AddItemModule } from '../../../master-module/item-module/add-item-module/add-item-module.module';
import { AddPartyPopupModule } from '../../../master-module/party-module/add-party-popup-module/add-party-popup-module.module';
import { VideoPlayModule } from '../../../video-play-module/video-play-module.module';
import { AddAddressModule } from '../../add-address-module/add-address-module.module';
import { AddChallanPopupModule } from '../../add-challan-popup-module/add-challan-popup-module.module';
import { AddDisclaimerPopupModule } from '../../add-disclaimer-popup-module/add-disclaimer-popup-module.module';
import { AddTripChallanPopupModule } from '../../../sub-main-trip-module/new-trip-module/add-trip-challan-popup-module/add-trip-challan-popup-module.module';
import { AddBillOfSupplyComponent } from './add-bill-of-supply/add-bill-of-supply.component';
import { AdvancesPopupModule } from '../../../sub-main-trip-module/new-trip-module/new-trip/advances-popup/advances-popup-module.module';
import { ChargesPopupModule } from '../../../sub-main-trip-module/new-trip-module/new-trip/charges-popup/charges-popup-module.module';
import { EditTripNewPopUpModule } from '../../../sub-main-trip-module/new-trip-module/new-trip/edit-trip-new-pop-up/edit-trip-new-pop-up-module.module';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { CreditLimitModule } from '../../../credit-limit-module/credit-limit-module.module';


@NgModule({
  declarations: [AddBillOfSupplyComponent],
  imports: [
    CommonModule,
    AddEditBosModuleRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    SharedModule,
    MatCheckboxModule,
    VideoPlayModule,
    AddItemModule,
    AddPartyPopupModule,
    AddChallanPopupModule,
    AddTripChallanPopupModule,
    AddAddressModule,
    AddDisclaimerPopupModule,
    ChargesPopupModule,
    AdvancesPopupModule,
    MatMomentDateModule,
    EditTripNewPopUpModule,
    CreditLimitModule
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
})
export class AddEditBosModule { }
