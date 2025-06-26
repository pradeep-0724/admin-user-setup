import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyTripModuleRoutingModule } from './company-trip-module-routing.module';
import { CompanyTripSettingComponent } from './company-trip-setting.component';
import { CompanyTripSettingCustomFiledsComponent } from './company-trip-setting-custom-fileds/company-trip-setting-custom-fileds.component';
import { CompanyTripSettingPreferencesComponent } from './company-trip-setting-preferences/company-trip-setting-preferences.component';
import { FormsModule } from '@angular/forms';
import { OrganizationSharedModeule } from '../organization-shared-modeule/organization-shared-modeule.module';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';

@NgModule({
  declarations: [CompanyTripSettingComponent, CompanyTripSettingCustomFiledsComponent, CompanyTripSettingPreferencesComponent],
  imports: [
    CommonModule,
    CompanyTripModuleRoutingModule,
    OrganizationSharedModeule,
    AlertPopupModuleModule,
    AppErrorModuleModule,
    FormsModule
  ]
})
export class CompanyTripModuleModule { }
