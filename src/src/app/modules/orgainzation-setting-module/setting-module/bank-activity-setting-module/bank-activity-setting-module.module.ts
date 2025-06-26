import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BankActivitySettingModuleRoutingModule } from './bank-activity-setting-module-routing.module';
import { BankactivityPrefrencesComponent } from './bankactivity-prefrences/bankactivity-prefrences.component';
import { BankactivityCustomFieldComponent } from './bankactivity-custom-field/bankactivity-custom-field.component';
import { BankactivityComponentComponent } from './bankactivity-component.component';
import { OrganizationSharedModeule } from '../organization-shared-modeule/organization-shared-modeule.module';

@NgModule({
  declarations: [BankactivityPrefrencesComponent, BankactivityCustomFieldComponent, BankactivityComponentComponent],
  imports: [
    CommonModule,
    BankActivitySettingModuleRoutingModule,
    OrganizationSharedModeule

  ]
})
export class BankActivitySettingModuleModule { }
