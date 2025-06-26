import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InspectionFormSettingsRoutingModule } from './inspection-form-settings-routing.module';
import { AddEditInspectionFormsComponent } from './add-edit-inspection-forms/add-edit-inspection-forms.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ViewUploadedDocumentModule } from '../../organiation-profile-v2/view-uploaded-document/view-uploaded-document.module';
import { MaterialDropDownModule } from 'src/app/modules/customerapp-module/material-drop-down-module/material-drop-down-module.module';


@NgModule({
  declarations: [
    AddEditInspectionFormsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppErrorModuleModule,
    MatCheckboxModule,
    MaterialDropDownModule,
    ViewUploadedDocumentModule,
    InspectionFormSettingsRoutingModule
  ]
})
export class InspectionFormSettingsModule { }
