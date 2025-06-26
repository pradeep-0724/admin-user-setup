import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetsHeaderSectionComponent } from './assets-header-section/assets-header-section.component';
import { AssetsDetailsSectionComponent } from './assets-details-section/assets-details-section.component';
import { AssetsInfoSectionComponent } from './assets-info-section/assets-info-section.component';
import { AssetsTyreDetailsSectionComponent } from './assets-tyre-details-section/assets-tyre-details-section.component';
import { AssetsViewModuleRoutingModule } from './view-assets-module-routing.module';
import { VehicleTyrePositionLayoutModule } from '../../tyre-master-module/vehicle-tyre-position-layout/vehicle-tyre-position-layout.module';
import { ChartsModule } from 'ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VehicleDetailsV2RoutingModule } from '../../vehicle-module/own-venicle-module/vehicle-details-v2/vehicle-details-v2-routing.module';
import { DateDropDownModule } from '../../vehicle-module/own-venicle-module/vehicle-details-v2/date-drop-down-module/date-drop-down-module.module';
import { TableWidgetModule } from '../../vehicle-module/own-venicle-module/vehicle-details-v2/table-widget-module/table-widget-module.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ViewUploadedDocumentModule } from 'src/app/modules/orgainzation-setting-module/organiation-profile-v2/view-uploaded-document/view-uploaded-document.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DialogModule } from '@angular/cdk/dialog';
import { MaterialDropDownModule } from '../../../material-drop-down-module/material-drop-down-module.module';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { RouterModule } from '@angular/router';
import { AddPartyPopupModule } from '../../party-module/add-party-popup-module/add-party-popup-module.module';
import { VehicleSharedModuleModule } from '../../vehicle-module/vehicle-shared-module/vehicle-shared-module.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatIconModule } from '@angular/material/icon';
import { ServiceHistoryModule } from '../../../operations-module/maintenance-module/add-edit-job-card-service/service-history-list/service-history-module.module';
import { MatNativeDateModule } from '@angular/material/core';
import { VehicleCertifcatesHistoryModule } from '../../vehicle-module/own-venicle-module/vehicle-details-v2/vehicle-details-v2/vehicle-certifcates-history/vehicle-certifcates-history.module';
import { AssetsRenewPopupComponent } from './assets-renew-popup/assets-renew-popup.component';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { PermitsSharedModule } from '../../permits-shared-module/permits-shared-module.module';
import { AssetsJobHistoryComponent } from './assets-job-history/assets-job-history.component';
import { AssetsServiceHistoryComponent } from './assets-service-history/assets-service-history.component';
 



@NgModule({
  declarations: [
    AssetsHeaderSectionComponent,
    AssetsDetailsSectionComponent,
    AssetsInfoSectionComponent,
    AssetsTyreDetailsSectionComponent,
    AssetsRenewPopupComponent,
    AssetsJobHistoryComponent,
    AssetsServiceHistoryComponent
  ],
  imports: [
    CommonModule,
    AssetsViewModuleRoutingModule,
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
    ServiceHistoryModule,
    VehicleTyrePositionLayoutModule,
    VehicleCertifcatesHistoryModule,
    SharedModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    PermitsSharedModule
    
  ]
})
export class ViewAssetsModuleModule { }
