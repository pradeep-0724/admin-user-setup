import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobCardSettingModuleRoutingModule } from './jobcard-setting-module-routing.module';
import { JobCardPreferencesComponent } from './jobcard-preferences/jobcard-preferences.component';
import { JobCardCustomFieldComponent } from './jobcard-custom-field/jobcard-custom-field.component';
import { JobCardSettingComponent } from './jobcard-setting.component';
import { OrganizationSharedModeule } from '../organization-shared-modeule/organization-shared-modeule.module';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';

@NgModule({
  declarations: [JobCardPreferencesComponent, JobCardCustomFieldComponent,JobCardSettingComponent],
  imports: [
    CommonModule,
    JobCardSettingModuleRoutingModule,
    OrganizationSharedModeule,
    AlertPopupModuleModule,
    AppErrorModuleModule,
    
  ]
})
export class JobCardSettingModuleModule { }
