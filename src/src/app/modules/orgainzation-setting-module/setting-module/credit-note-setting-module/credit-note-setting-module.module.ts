import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreditNoteSettingModuleRoutingModule } from './credit-note-setting-module-routing.module';
import { CreditNotePreferencesComponent } from './credit-note-preferences/credit-note-preferences.component';
import { CreditNoteCustomFieldComponent } from './credit-note-custom-field/credit-note-custom-field.component';
import { CreditNoteSettingComponent } from './credit-note-setting.component';
import { OrganizationSharedModeule } from '../organization-shared-modeule/organization-shared-modeule.module';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { GeneralConfigurationModule } from '../general-configuration/general-configuration.module';

@NgModule({
  declarations: [CreditNotePreferencesComponent, CreditNoteCustomFieldComponent,CreditNoteSettingComponent],
  imports: [
    CommonModule,
    CreditNoteSettingModuleRoutingModule,
    OrganizationSharedModeule,
    AlertPopupModuleModule,
    AppErrorModuleModule,
    GeneralConfigurationModule
    
  ]
})
export class CreditNoteSettingModuleModule { }
