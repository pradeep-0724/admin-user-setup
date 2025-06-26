import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocalPurchaseOrderSettingModuleRoutingModule } from './local-purchase-order-setting-module-routing.module';
import { LocalPurchaseOrderSettingComponent } from './local-purchase-order-setting.component';
import { LocalPurchaseOrderPrefrencesComponent } from './local-purchase-order-prefrences/local-purchase-order-prefrences.component';
import { OrganizationSharedModeule } from '../organization-shared-modeule/organization-shared-modeule.module';


@NgModule({
  declarations: [
    LocalPurchaseOrderSettingComponent,
    LocalPurchaseOrderPrefrencesComponent
  ],
  imports: [
    CommonModule,
    LocalPurchaseOrderSettingModuleRoutingModule,
    OrganizationSharedModeule
  ]
})
export class LocalPurchaseOrderSettingModuleModule { }
