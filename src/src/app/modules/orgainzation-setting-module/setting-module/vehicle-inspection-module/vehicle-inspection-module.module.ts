import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehicleInspectionModuleRoutingModule } from './vehicle-inspection-module-routing.module';
import { VehicleInspectionPreferenceComponent } from './vehicle-inspection-preference/vehicle-inspection-preference.component';
import { OrganizationSharedModeule } from '../organization-shared-modeule/organization-shared-modeule.module';
import { VehicleInspectionSettingsComponent } from './vehicle-inspection-settings/vehicle-inspection-settings.component';
import { VehicleInspectionCustomFieldsComponent } from './vehicle-inspection-custom-fields/vehicle-inspection-custom-fields.component';
import { DialogModule } from '@angular/cdk/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { FileUploaderV2Module } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/file-uploader-v2-module/file-uploader-module.module';
import { FileDeleteViewModule } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/new-trip-details-v2/file-delete-view-module/file-delete-view-module.module';
import { ViewUploadedDocumentModule } from '../../organiation-profile-v2/view-uploaded-document/view-uploaded-document.module';
import { DeleteAlertModule } from 'src/app/shared-module/delete-alert-module/delete-alert-module.module';
import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({
  declarations: [
    VehicleInspectionPreferenceComponent,
    VehicleInspectionSettingsComponent,
    VehicleInspectionCustomFieldsComponent
  ],
  imports: [
    CommonModule,
    OrganizationSharedModeule,
    DialogModule,
    ReactiveFormsModule,
    FileUploaderV2Module,
    FileDeleteViewModule,
    ViewUploadedDocumentModule,
    DeleteAlertModule,
    MatCheckboxModule,
    VehicleInspectionModuleRoutingModule
  ]
})
export class VehicleInspectionModuleModule { }
