import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebitNoteSettingModuleRoutingModule } from './debit-note-setting-module-routing.module';
import { DebitNoteCustomFieldComponent } from './debit-note-custom-field/debit-note-custom-field.component';
import { DebitNotePreferencesComponent } from './debit-note-preferences/debit-note-preferences.component';
import { DebitNoteSettingComponent } from './debit-note-setting.component';
import { OrganizationSharedModeule } from '../organization-shared-modeule/organization-shared-modeule.module';
import { GeneralConfigurationModule } from '../general-configuration/general-configuration.module';

@NgModule({
  declarations: [DebitNoteCustomFieldComponent, DebitNotePreferencesComponent,DebitNoteSettingComponent],
  imports: [
    CommonModule,
    DebitNoteSettingModuleRoutingModule,
    GeneralConfigurationModule,
    OrganizationSharedModeule
  ]
})
export class DebitNoteSettingModuleModule { }
