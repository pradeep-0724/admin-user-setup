import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingModuleRoutingModule } from './setting-module-routing.module';
import { PreferencesCustomfiledComponent } from './preferences-customfiled.component';
import { SettingsSlidebarComponent } from './settings-slidebar/settings-slidebar.component';
import { NgxPermissionsModule } from 'ngx-permissions';


@NgModule({
  declarations: [PreferencesCustomfiledComponent, SettingsSlidebarComponent],
  imports: [
    CommonModule,
    SettingModuleRoutingModule,
    NgxPermissionsModule.forChild()

  ]
})
export class SettingModuleModule { }
