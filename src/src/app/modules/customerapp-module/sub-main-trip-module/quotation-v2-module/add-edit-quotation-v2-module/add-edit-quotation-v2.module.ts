import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditQuotationV2RoutingModule } from './add-edit-quotation-v2-module-routing.module';
import { AddEditQuotationV2Component } from './add-edit-quotation-v2/add-edit-quotation-v2.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MaterialDropDownModule } from '../../../material-drop-down-module/material-drop-down-module.module';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { ToolTipModule } from '../../new-trip-v2/tool-tip/tool-tip.module';
import { AddPartyPopupModule } from '../../../master-module/party-module/add-party-popup-module/add-party-popup-module.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MultipleDestinationModule2 } from './multiple-destination/multiple-destination-2.module';
import { GoThroughModule } from '../../../go-through/go-through.module';
import { DateAdapter } from '@angular/material/core';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { CreditLimitModule } from '../../../credit-limit-module/credit-limit-module.module';
import { QuotationAddEditCustomColumnModule } from '../quotation-add-edit-custom-column/quotation-add-edit-custom-column.module';
import { ItemOthersQuotationModule } from '../item-others-quotation/item-others-quotation.module';
import { QuotationTemplateTruckComponent } from './quotation-template-truck/quotation-template-truck.component';
import { AddEditQuotationCransComponent } from './add-edit-quotation-crans/add-edit-quotation-crans.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LocationV2Module } from '../../new-trip-v2/location-v2/location-v2.module';
import { GoogleMapsModule } from '@angular/google-maps';
import { DialogModule } from '@angular/cdk/dialog';
import { AddAdditionalChargePopupModule } from '../../../master-module/party-module/rate-card-module/add-additional-charge-popup/add-additional-charge-popup-module.module';
import { QuotationV2ValidationPopupComponent } from './quotation-v2-validation-popup/quotation-v2-validation-popup.component';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AddTripV2DocumentsExpiryModule } from '../../new-trip-v2/add-trip-v2/add-trip-v2-documents-expiry/add-trip-v2-documents-expiry.module';
import { QuotationTemplateTrailerComponent } from './quotation-template-trailer/quotation-template-trailer.component';
import { GenericFreightMaterialSectionModule } from '../../generic-freight-material-section/generic-freight-material-section.module';
import { BillingTypesV2Module } from '../../new-trip-v2/billing-types-v2/billing-types-v2.module';


@NgModule({
  declarations: [
    AddEditQuotationV2Component,
    QuotationTemplateTruckComponent,
    AddEditQuotationCransComponent,
    QuotationV2ValidationPopupComponent,
    QuotationTemplateTrailerComponent,
  ],
  imports: [
    CommonModule,
    GoThroughModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MaterialDropDownModule,
    AppErrorModuleModule,
    ToolTipModule,
    AddPartyPopupModule,
    MatCheckboxModule,
    MultipleDestinationModule2,
    MatMomentDateModule,
    CreditLimitModule,
    QuotationAddEditCustomColumnModule,
    ItemOthersQuotationModule,
    AddEditQuotationV2RoutingModule,
    LocationV2Module,
    GoogleMapsModule,
    DialogModule,
    MatTooltipModule,
    AddTripV2DocumentsExpiryModule,
    AddAdditionalChargePopupModule,
    MatButtonModule, MatMenuModule,
    GenericFreightMaterialSectionModule,
    BillingTypesV2Module
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }]

})
export class AddEditQuotationV2Module { }
