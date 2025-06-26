import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { VehicleDetailsV2RoutingModule } from './vehicle-details-v2-routing.module';
import { VehicleDetailsV2Component } from './vehicle-details-v2/vehicle-details-v2.component';
import { VehicleDetailsHeaderSectionComponent } from './vehicle-details-header-section/vehicle-details-header-section.component';
import { VehicleDetailsOverViewSectionComponent } from './vehicle-details-over-view-section/vehicle-details-over-view-section.component';
import { VehicleDetailsVehicleInfoSectionComponent } from './vehicle-details-vehicle-info-section/vehicle-details-vehicle-info-section.component';
import { VehicleDetailsServiceHistorySectionComponent } from './vehicle-details-service-history-section/vehicle-details-service-history-section.component';
import { VehicleDetailsFuelHistorySectionComponent } from './vehicle-details-fuel-history-section/vehicle-details-fuel-history-section.component';
import { DateDropDownModule } from './date-drop-down-module/date-drop-down-module.module';
import { VehicleDetailsTripHistoryComponent } from './vehicle-details-trip-history/vehicle-details-trip-history.component';
import { TableWidgetModule } from './table-widget-module/table-widget-module.module';
import { VehicleDetailsV2EMIPaidPopupComponent } from './vehicle-details-v2-emi-paid-popup/vehicle-details-v2-emi-paid-popup.component';
import { DialogModule } from '@angular/cdk/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MaterialDropDownModule } from '../../../../material-drop-down-module/material-drop-down-module.module';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { AddPartyPopupModule } from '../../../party-module/add-party-popup-module/add-party-popup-module.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { RouterModule } from '@angular/router';
import { VehicleSharedModuleModule } from '../../vehicle-shared-module/vehicle-shared-module.module';
import { DateAdapter, MatRippleModule } from '@angular/material/core';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatIconModule } from '@angular/material/icon';
import { ServiceHistoryModule } from '../../../../operations-module/maintenance-module/add-edit-job-card-service/service-history-list/service-history-module.module';
import { ViewUploadedDocumentModule } from '../../../../../orgainzation-setting-module/organiation-profile-v2/view-uploaded-document/view-uploaded-document.module';
import { TyreMasterReportViewComponent } from './tyre-master-report-view/tyre-master-report-view.component';
import { VehicleTyrePositionLayoutModule } from '../../../tyre-master-module/vehicle-tyre-position-layout/vehicle-tyre-position-layout.module';
import { VehicleCertifcatesHistoryModule } from './vehicle-details-v2/vehicle-certifcates-history/vehicle-certifcates-history.module';
import { FileDeleteViewModule } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/new-trip-details-v2/file-delete-view-module/file-delete-view-module.module';
import { PermitsSharedModule } from '../../../permits-shared-module/permits-shared-module.module';
import { SharedModule } from 'src/app/shared-module/shared.module';



@NgModule({
  declarations: [
    VehicleDetailsV2Component,
    VehicleDetailsHeaderSectionComponent,
    VehicleDetailsOverViewSectionComponent,
    VehicleDetailsVehicleInfoSectionComponent,
    VehicleDetailsServiceHistorySectionComponent,
    VehicleDetailsFuelHistorySectionComponent,
    VehicleDetailsTripHistoryComponent,
    VehicleDetailsV2EMIPaidPopupComponent,
    TyreMasterReportViewComponent,    
  ],
  imports: [
    CommonModule,
    ChartsModule,
    ReactiveFormsModule,
    FormsModule,
    VehicleDetailsV2RoutingModule,
    DateDropDownModule,
    TableWidgetModule,
    MatDatepickerModule,
    ViewUploadedDocumentModule,
    MatFormFieldModule,
    MatInputModule,
    DialogModule,
    MaterialDropDownModule,
    AppErrorModuleModule,
    RouterModule,
    AddPartyPopupModule,
    VehicleSharedModuleModule,
    MatCheckboxModule,
    MatMomentDateModule,
    MatIconModule,
    SharedModule,
    ServiceHistoryModule,
    VehicleTyrePositionLayoutModule,
    MatRippleModule,
    FileDeleteViewModule,
    VehicleCertifcatesHistoryModule,
    PermitsSharedModule
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }]

})
export class VehicleDetailsV2Module { }
