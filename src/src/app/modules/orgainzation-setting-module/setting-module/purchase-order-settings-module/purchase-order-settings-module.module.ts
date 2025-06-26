import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseOrderSettingsModuleRoutingModule } from './purchase-order-settings-module-routing.module';
import { PurchaseOrderSettingComponent } from './purchase-order-setting.component';
import { PurchaseOrderPreferencesComponent } from './purchase-order-preferences/purchase-order-preferences.component';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { OrganizationSharedModeule } from '../organization-shared-modeule/organization-shared-modeule.module';

@NgModule({
  declarations: [PurchaseOrderSettingComponent, PurchaseOrderPreferencesComponent],
  imports: [
    CommonModule,
    PurchaseOrderSettingsModuleRoutingModule,
    OrganizationSharedModeule,
    AlertPopupModuleModule,
    AppErrorModuleModule,
  ]
})
export class PurchaseOrderSettingsModuleModule { }
