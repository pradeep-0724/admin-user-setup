import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditVehicleV2RoutingModule } from './add-edit-vehicle-v2-routing.module';
import { VehicleTypeSectionV2Component } from './vehicle-type-section-v2/vehicle-type-section-v2.component';
import { VehicleDocumentSectionV2Component } from './vehicle-document-section-v2/vehicle-document-section-v2.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { AddPartyPopupModule } from '../../../party-module/add-party-popup-module/add-party-popup-module.module';
import { GoThroughModule } from '../../../../go-through/go-through.module';
import { VideoPlayModule } from '../../../../video-play-module/video-play-module.module';
import { FileUploaderV2Module } from '../../../../sub-main-trip-module/new-trip-v2/file-uploader-v2-module/file-uploader-module.module';
import { FileDeleteViewModule } from '../../../../sub-main-trip-module/new-trip-v2/new-trip-details-v2/file-delete-view-module/file-delete-view-module.module';
import { VehicleTyrePositionLayoutModule } from '../../../tyre-master-module/vehicle-tyre-position-layout/vehicle-tyre-position-layout.module';
import { MatTabsModule } from '@angular/material/tabs';
import { VehicleDetailsV2Component } from './vehicle-details-v2/vehicle-details-v2.component';
import { SubAssetsOwnVehicleComponent } from './sub-assets-own-vehicle/sub-assets-own-vehicle.component';
import { TyreMasterTyreMasterComponent } from './tyre-master-tyre-master/tyre-master-tyre-master.component';
import { AddEditOwnVehicleItemsComponent } from './add-edit-own-vehicle-items/add-edit-own-vehicle-items.component';
import { DialogModule } from '@angular/cdk/dialog';
import { DeleteOwnVehicleItemsComponent } from './delete-own-vehicle-items/delete-own-vehicle-items.component';
import { PermitSectionOwnVehicleComponent } from './permit-section-own-vehicle/permit-section-own-vehicle.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MultiDriverModule } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/multi-driver-module/multi-driver-module.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxPermissionsModule } from 'ngx-permissions';


@NgModule({
  declarations: [
    VehicleTypeSectionV2Component,
    VehicleDocumentSectionV2Component,
    VehicleDetailsV2Component,
    SubAssetsOwnVehicleComponent,
    TyreMasterTyreMasterComponent,
    AddEditOwnVehicleItemsComponent,
    DeleteOwnVehicleItemsComponent,
    PermitSectionOwnVehicleComponent,
  ],
  imports: [
    CommonModule,
    AddEditVehicleV2RoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    SharedModule,
    AddPartyPopupModule,
    GoThroughModule,
    VideoPlayModule,
    FileDeleteViewModule,
    FileUploaderV2Module,
    MatTabsModule,
    DialogModule,
    VehicleTyrePositionLayoutModule,
    MatRippleModule,
    MatCheckboxModule,
    MultiDriverModule,
    NgMultiSelectDropDownModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxPermissionsModule.forChild()

  ]
})
export class AddEditVehicleV2Module { }
