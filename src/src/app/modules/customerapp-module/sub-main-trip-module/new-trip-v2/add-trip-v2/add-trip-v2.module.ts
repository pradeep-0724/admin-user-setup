import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTripV2RoutingModule } from './add-trip-v2-routing.module';
import { AddTripV2Component } from './add-trip-v2/add-trip-v2.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialDropDownModule } from '../../../material-drop-down-module/material-drop-down-module.module';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { AddPartyPopupModule } from '../../../master-module/party-module/add-party-popup-module/add-party-popup-module.module';
import { MultipleDestinationModule } from '../multiple-destination/multiple-destination.module';
import { BillingTypesV2Module } from '../billing-types-v2/billing-types-v2.module';
import {MatTabsModule} from '@angular/material/tabs';
import { DriverAllowanceV2Module } from '../driver-allowance-v2/driver-allowance-v2.module';
import { RouterModule } from '@angular/router';
import { CustomFieldModule } from '../custom-field-module/custom-field-module.module';
import { ToolTipModule } from '../tool-tip/tool-tip.module';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { GoThroughModule } from '../../../go-through/go-through.module';
import { FileUploaderV2Module } from '../file-uploader-v2-module/file-uploader-module.module';
import { FileDeleteViewModule } from '../new-trip-details-v2/file-delete-view-module/file-delete-view-module.module';
import { MultiDriverModule } from '../multi-driver-module/multi-driver-module.module';
import { AddTripV2DocumentsExpiryModule } from './add-trip-v2-documents-expiry/add-trip-v2-documents-expiry.module';
import { CreditLimitModule } from '../../../credit-limit-module/credit-limit-module.module';
import { AddMarketVehiclePopupModule } from '../add-market-vehicle-popup/add-market-vehicle-popup.module';
import { AddJobTemplateOthersComponent } from './add-job-template-others/add-job-template-others.component';
import { AddJobTemplateCraneComponent } from './add-job-template-crane/add-job-template-crane.component';
import { CheckListModule } from '../check-list/check-list.module';
import { GoogleMapsModule } from '@angular/google-maps';
import { LocationV2Module } from '../location-v2/location-v2.module';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OldTripDataComponent } from './old-trip-data/old-trip-data.component';
import { AddTripV2ValidationComponent } from './add-trip-v2-validation/add-trip-v2-validation.component';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { DateAndTimeModule } from '../../../date-and-time-module/date-and-time-module.module';
import { AddJobTemplateTrailerLooseCargoComponent } from './add-job-template-trailer-loose-cargo/add-job-template-trailer-loose-cargo.component';
import { GenericFreightMaterialSectionModule } from '../../generic-freight-material-section/generic-freight-material-section.module';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { AddJobTemplateContainerComponent } from './add-job-template-container/add-job-template-container.component';
import { ContainerInfoPopupComponent } from './container-info-popup/container-info-popup.component';
import { MatIconModule } from '@angular/material/icon';
import { InspectionTypeModule } from '../../../inspection-type-module/inspection-type-module.module';
import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({
  declarations: [
    AddTripV2Component,
    AddJobTemplateOthersComponent,
    AddJobTemplateCraneComponent,
    OldTripDataComponent,
    AddTripV2ValidationComponent,
    AddJobTemplateTrailerLooseCargoComponent,
    AddJobTemplateContainerComponent,
    ContainerInfoPopupComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FileUploaderV2Module,
    FileDeleteViewModule,
    GoThroughModule,
    AddTripV2RoutingModule,
    ReactiveFormsModule,
    MaterialDropDownModule,
    AppErrorModuleModule,
    AddPartyPopupModule,
    MultipleDestinationModule,
    BillingTypesV2Module,
    MatTabsModule,
    DriverAllowanceV2Module,
    RouterModule,
    CustomFieldModule,
    ToolTipModule,
    MatCheckboxModule,
    FileUploaderV2Module,
    FileDeleteViewModule,
    AlertPopupModuleModule,
    MultiDriverModule,
    CreditLimitModule,
    CheckListModule,
    AddTripV2DocumentsExpiryModule,
    AddMarketVehiclePopupModule,
    LocationV2Module,
    GoogleMapsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatMomentDateModule,
    DateAndTimeModule,
    GenericFreightMaterialSectionModule,
    FormsModule,
    MatButtonModule, MatMenuModule,MatIconModule,
    InspectionTypeModule
  ],
  providers:[{ provide: DateAdapter, useClass: AppDateAdapter }],
})
export class AddTripV2Module { }
