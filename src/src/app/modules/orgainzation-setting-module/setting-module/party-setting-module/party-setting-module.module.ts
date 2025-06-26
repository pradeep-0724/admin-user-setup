import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartySettingModuleRoutingModule } from './party-setting-module-routing.module';
import { PrefrenceComponent } from './prefrence/prefrence.component';
import { PartySettingComponent } from './party-setting.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialDropDownModule } from '../../../customerapp-module/material-drop-down-module/material-drop-down-module.module';
import {MatRadioModule} from '@angular/material/radio';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { PartySettingsCustomFieldComponent } from './party-settings-custom-field/party-settings-custom-field.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { OrganizationSharedModeule } from '../organization-shared-modeule/organization-shared-modeule.module';


@NgModule({
  declarations: [
    PrefrenceComponent,
    PartySettingComponent,
    PartySettingsCustomFieldComponent,
  ],
  imports: [
    CommonModule,
    PartySettingModuleRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialDropDownModule,
    MatRadioModule,
    MatCheckboxModule,
    OrganizationSharedModeule,
    AlertPopupModuleModule,

    SharedModule
  ]
})
export class PartySettingModuleModule { }
