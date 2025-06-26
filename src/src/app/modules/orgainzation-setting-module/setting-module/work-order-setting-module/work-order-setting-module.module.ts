import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkOrderSettingModuleRoutingModule } from './work-order-setting-module-routing.module';
import { WorkOrderSettingComponent } from './work-order-setting.component';
import { WorkOrderSettingPreferencesComponent } from './work-order-setting-preferences/work-order-setting-preferences.component';
import { WorkOrderSettingCustomFieldsComponent } from './work-order-setting-custom-fields/work-order-setting-custom-fields.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrganizationSharedModeule } from '../organization-shared-modeule/organization-shared-modeule.module';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { WorkOrderSettingValidationsComponent } from './work-order-setting-validations/work-order-setting-validations.component';
import { WorkOrderSettingApprovalComponent } from './work-order-setting-approval/work-order-setting-approval.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MaterialDropDownModule } from '../../../customerapp-module/material-drop-down-module/material-drop-down-module.module';
import { DeleteAlertModule } from 'src/app/shared-module/delete-alert-module/delete-alert-module.module';
import { AddEditValidationModule } from '../../../customerapp-module/add-edit-validation-module/add-edit-validation-module.module';

@NgModule({
  declarations: [WorkOrderSettingComponent, WorkOrderSettingPreferencesComponent, WorkOrderSettingCustomFieldsComponent, WorkOrderSettingValidationsComponent, WorkOrderSettingApprovalComponent],
  imports: [
    CommonModule,
    WorkOrderSettingModuleRoutingModule,
    OrganizationSharedModeule,
    AlertPopupModuleModule,
    AppErrorModuleModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatRadioModule,
    MaterialDropDownModule,
    DeleteAlertModule,
    AddEditValidationModule
  ]
})
export class WorkOrderSettingModule { }
