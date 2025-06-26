import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkOrderAddModueRoutingModule } from './work-order-add-modue-routing.module';
import { WorkOrderV2Component } from './work-order-v2/work-order-v2.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { AddPartyPopupModule } from '../../../master-module/party-module/add-party-popup-module/add-party-popup-module.module';
import { MaterialDropDownModule } from '../../../material-drop-down-module/material-drop-down-module.module';
import { BillingTypesV2Module } from '../../new-trip-v2/billing-types-v2/billing-types-v2.module';
import { CustomFieldModule } from '../../new-trip-v2/custom-field-module/custom-field-module.module';
import { MultipleDestinationModule } from '../../new-trip-v2/multiple-destination/multiple-destination.module';
import { ToolTipModule } from '../../new-trip-v2/tool-tip/tool-tip.module';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GoThroughModule } from '../../../go-through/go-through.module';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { CreditLimitModule } from '../../../credit-limit-module/credit-limit-module.module';
import { WorkOrderTemplateCraneComponent } from './work-order-template-crane/work-order-template-crane.component';
import { WorkOrderTemplateOthersComponent } from './work-order-template-others/work-order-template-others.component';
import { LocationV2Module } from '../../new-trip-v2/location-v2/location-v2.module';
import { GoogleMapsModule } from '@angular/google-maps';
import { DialogModule } from '@angular/cdk/dialog';
import { CheckListModule } from '../../new-trip-v2/check-list/check-list.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { WorkOrderValidationsPopupComponent } from './work-order-validations-popup/work-order-validations-popup.component';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AddTripV2DocumentsExpiryModule } from '../../new-trip-v2/add-trip-v2/add-trip-v2-documents-expiry/add-trip-v2-documents-expiry.module';
import { WorkOrderV2TemplateTrailerLooseCargoComponent } from './work-order-v2-template-trailer-loose-cargo/work-order-v2-template-trailer-loose-cargo.component';
import { GenericFreightMaterialSectionModule } from '../../generic-freight-material-section/generic-freight-material-section.module';
import { WorkOrderTemplateContainerComponent } from './work-order-template-container/work-order-template-container.component';
import { InspectionTypeModule } from '../../../inspection-type-module/inspection-type-module.module';


@NgModule({
  declarations: [
    WorkOrderV2Component,
    WorkOrderTemplateCraneComponent,
    WorkOrderTemplateOthersComponent,
    WorkOrderValidationsPopupComponent,
    WorkOrderV2TemplateTrailerLooseCargoComponent,
    WorkOrderTemplateContainerComponent
  ],
  imports: [
    CommonModule,
    GoThroughModule,
    WorkOrderAddModueRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialDropDownModule,
    AppErrorModuleModule,
    AddPartyPopupModule,
    MultipleDestinationModule,
    BillingTypesV2Module,
    MatTabsModule,
    RouterModule,
    CustomFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    CreditLimitModule,
    MatMomentDateModule,
    ToolTipModule,
    LocationV2Module,
    GoogleMapsModule,
    DialogModule,
    CheckListModule,
    MatCheckboxModule,
    SharedModule,
    AddTripV2DocumentsExpiryModule,
    MatButtonModule, MatMenuModule,
    GenericFreightMaterialSectionModule,
    InspectionTypeModule
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
})
export class WorkOrderAddModue{ }
