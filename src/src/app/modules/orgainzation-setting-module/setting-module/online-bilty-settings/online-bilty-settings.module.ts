import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlineBiltySettingsRoutingModule } from './online-bilty-settings-routing.module';
import { OnlineBiltySettingComponent } from './online-bilty-setting.component';
import { OnlineBiltyPrefrencesComponent } from './online-bilty-prefrences/online-bilty-prefrences.component';
import { OnlineBiltyCustomFieldComponent } from './online-bilty-custom-field/online-bilty-custom-field.component';
import { OrganizationSharedModeule } from '../organization-shared-modeule/organization-shared-modeule.module';

@NgModule({
  declarations: [OnlineBiltySettingComponent, OnlineBiltyPrefrencesComponent, OnlineBiltyCustomFieldComponent],
  imports: [
    CommonModule,
    OnlineBiltySettingsRoutingModule,
    OrganizationSharedModeule
  ]
})
export class OnlineBiltySettingsModule { }
