import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCustomFieldsComponent } from './add-custom-fields/add-custom-fields.component';
import { AddPrefixComponent } from './add-prefix/add-prefix.component';
import { TCDialog, AddTacComponent } from './add-tac/add-tac.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { MaterialDropDownModule } from '../../../customerapp-module/material-drop-down-module/material-drop-down-module.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { AddCustomFieldV2Component } from './add-custom-field-v2/add-custom-field-v2.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ApprovalComponent } from './approval/approval.component';
import { MatRadioModule } from '@angular/material/radio';
import { AddEditValidationModule } from '../../../customerapp-module/add-edit-validation-module/add-edit-validation-module.module';
import { ValidationComponent } from './validation/validation.component';
import {DialogModule} from '@angular/cdk/dialog';
import { PdfHeadingNativeComponent } from './pdf-heading-native/pdf-heading-native.component';
import { SharedModule } from 'src/app/shared-module/shared.module';

@NgModule({
  declarations: [AddCustomFieldsComponent,AddPrefixComponent,TCDialog,AddTacComponent, AddCustomFieldV2Component,
    ApprovalComponent, ValidationComponent, PdfHeadingNativeComponent
  ],
  imports: [
    AddEditValidationModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppErrorModuleModule,
    MaterialDropDownModule,
    AngularEditorModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    MatRadioModule,
    SharedModule,
    DialogModule
    
  ],
  exports:[AddCustomFieldsComponent,AddPrefixComponent,TCDialog,AddTacComponent, 
    AddCustomFieldV2Component, ApprovalComponent, ValidationComponent,PdfHeadingNativeComponent],
})
export class OrganizationSharedModeule { }
