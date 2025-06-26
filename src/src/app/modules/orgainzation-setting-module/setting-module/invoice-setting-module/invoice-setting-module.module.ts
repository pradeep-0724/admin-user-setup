import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceSettingModuleRoutingModule } from './invoice-setting-module-routing.module';
import { InvoicePreferencesComponent } from './invoice-preferences/invoice-preferences.component';
import { InvoiceCustomFieldComponent } from './invoice-custom-field/invoice-custom-field.component';
import { InvoiceSettingComponent } from './invoice-setting.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrganizationSharedModeule } from '../organization-shared-modeule/organization-shared-modeule.module';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MaterialDropDownModule } from 'src/app/modules/customerapp-module/material-drop-down-module/material-drop-down-module.module';
import { DeleteAlertModule } from 'src/app/shared-module/delete-alert-module/delete-alert-module.module';
import { AddEditValidationModule } from 'src/app/modules/customerapp-module/add-edit-validation-module/add-edit-validation-module.module';
import { InvoiceTableConfigModule } from './invoice-table-config-module/invoice-table-config-module.module';
import { ToolTipModule } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/tool-tip/tool-tip.module';
import { GeneralConfigurationModule } from '../general-configuration/general-configuration.module';


@NgModule({
  declarations: [InvoicePreferencesComponent, InvoiceCustomFieldComponent,InvoiceSettingComponent],
  imports: [
    CommonModule,
    InvoiceSettingModuleRoutingModule,
    OrganizationSharedModeule,
    FormsModule,
    ToolTipModule,
    CommonModule,
    AlertPopupModuleModule,
    AppErrorModuleModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatRadioModule,
    MaterialDropDownModule,
    DeleteAlertModule,
    AddEditValidationModule,
    GeneralConfigurationModule,
    InvoiceTableConfigModule,
  ]
})
export class InvoiceSettingModuleModule { }
