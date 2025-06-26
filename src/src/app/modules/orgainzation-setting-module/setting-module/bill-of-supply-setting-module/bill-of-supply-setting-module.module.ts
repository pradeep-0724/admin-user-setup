import { NgxPermissionsModule } from 'ngx-permissions';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillOfSupplySettingModuleRoutingModule } from './bill-of-supply-setting-module-routing.module';
import { BillOfSupplyCustomFieldComponent } from './bill-of-supply-custom-field/bill-of-supply-custom-field.component';
import { BillOfSupplyPreferencesComponent } from './bill-of-supply-preferences/bill-of-supply-preferences.component';
import { FormsModule } from '@angular/forms';
import { BillofsupplysettingsComponent } from './billofsupplysettings.component';
import { OrganizationSharedModeule } from '../organization-shared-modeule/organization-shared-modeule.module';
import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({
  declarations: [BillOfSupplyCustomFieldComponent, BillOfSupplyPreferencesComponent, BillofsupplysettingsComponent],
  imports: [
    CommonModule,
    BillOfSupplySettingModuleRoutingModule,
    FormsModule,
    NgxPermissionsModule.forChild(),
    OrganizationSharedModeule,
    MatCheckboxModule
  ]
})
export class BillOfSupplySettingModuleModule { }
