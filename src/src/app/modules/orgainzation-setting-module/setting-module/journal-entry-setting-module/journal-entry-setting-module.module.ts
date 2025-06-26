import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JournalEntrySettingModuleRoutingModule } from './journal-entry-setting-module-routing.module';
import { JournalEntryCustomFieldComponent } from './journal-entry-custom-field/journal-entry-custom-field.component';
import { JournalEntryPreferencesComponent } from './journal-entry-preferences/journal-entry-preferences.component';
import { JournalEntrySettingComponent } from './journal-entry-setting.component';
import { OrganizationSharedModeule } from '../organization-shared-modeule/organization-shared-modeule.module';

@NgModule({
  declarations: [JournalEntryCustomFieldComponent, JournalEntryPreferencesComponent,JournalEntrySettingComponent],
  imports: [
    CommonModule,
    JournalEntrySettingModuleRoutingModule,
    OrganizationSharedModeule
  ]
})
export class JournalEntrySettingModuleModule { }
