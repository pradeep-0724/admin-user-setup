import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SiteInspectionModuleRoutingModule } from './site-inspection-module-routing.module';
import { SiteInspectionSettingsComponent } from './site-inspection-settings/site-inspection-settings.component';
import { DialogModule } from '@angular/cdk/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { FileUploaderV2Module } from '../../../customerapp-module/sub-main-trip-module/new-trip-v2/file-uploader-v2-module/file-uploader-module.module';
import { FileDeleteViewModule } from '../../../customerapp-module/sub-main-trip-module/new-trip-v2/new-trip-details-v2/file-delete-view-module/file-delete-view-module.module';
import { SiteInspectionPrefrencesComponent } from './site-inspection-prefrences/site-inspection-prefrences.component';
import { SiteInspectionCustomFieldsComponent } from './site-inspection-custom-fields/site-inspection-custom-fields.component';
import { OrganizationSharedModeule } from '../organization-shared-modeule/organization-shared-modeule.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ViewUploadedDocumentModule } from '../../organiation-profile-v2/view-uploaded-document/view-uploaded-document.module';
import { DeleteAlertModule } from 'src/app/shared-module/delete-alert-module/delete-alert-module.module';


@NgModule({
  declarations: [
    SiteInspectionSettingsComponent,
    SiteInspectionPrefrencesComponent,
    SiteInspectionCustomFieldsComponent
  ],
  imports: [
    CommonModule,
    DialogModule,
    ReactiveFormsModule,
    SharedModule,
    SiteInspectionModuleRoutingModule,
    FileUploaderV2Module,
    FileDeleteViewModule,
    OrganizationSharedModeule,
    ViewUploadedDocumentModule,
    DeleteAlertModule,
    MatCheckboxModule
  ]
})
export class SiteInspectionModuleModule { }
