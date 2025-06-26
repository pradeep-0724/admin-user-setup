import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransporterTripSettingsModuleRoutingModule } from './transporter-trip-settings-module-routing.module';
import { TransporterTripSettingComponent } from './transporter-trip-setting.component';
import { TransporterTripCustomFieldComponent } from './transporter-trip-custom-field/transporter-trip-custom-field.component';
import { TransporterTripCustomPreferencesComponent } from './transporter-trip-custom-preferences/transporter-trip-custom-preferences.component';
import { FormsModule } from '@angular/forms';
import { OrganizationSharedModeule } from '../organization-shared-modeule/organization-shared-modeule.module';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';

@NgModule({
  declarations: [TransporterTripSettingComponent, TransporterTripCustomFieldComponent, TransporterTripCustomPreferencesComponent],
  imports: [
    CommonModule,
    TransporterTripSettingsModuleRoutingModule,
    OrganizationSharedModeule,
    AlertPopupModuleModule,
    AppErrorModuleModule,
    FormsModule
  ]
})
export class TransporterTripSettingsModuleModule { }
