import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrefrencesComponent } from './prefrences/prefrences.component';
import { CustomFieldComponent } from './custom-field/custom-field.component';
import { PaymentSettlementSettingRoutingModule } from './payment-settlement-setting-module-routing.module';
import { PaymentSettlementSettingComponent } from './payment-settlement-setting.component';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { OrganizationSharedModeule } from '../organization-shared-modeule/organization-shared-modeule.module';

@NgModule({
  declarations: [PrefrencesComponent, CustomFieldComponent, PaymentSettlementSettingComponent],
  imports: [
    PaymentSettlementSettingRoutingModule,
    CommonModule,
    OrganizationSharedModeule,
    AlertPopupModuleModule,
    AppErrorModuleModule,
  ],
  exports:[PrefrencesComponent, CustomFieldComponent, PaymentSettlementSettingComponent]
})
export class PaymentSettlementSettingModuleModule { }
