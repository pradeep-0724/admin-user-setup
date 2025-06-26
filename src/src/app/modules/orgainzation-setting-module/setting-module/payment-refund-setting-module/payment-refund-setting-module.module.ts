import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrefrencesComponent } from './prefrences/prefrences.component';
import { CustomFieldComponent } from './custom-field/custom-field.component';
import { PaymentRefundSettingComponent } from './payment-refund-setting.component';
import { PaymentRefundSettingRoutingModule } from './payment-refund-setting-module-routing.module';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { OrganizationSharedModeule } from '../organization-shared-modeule/organization-shared-modeule.module';

@NgModule({
  declarations: [PrefrencesComponent, CustomFieldComponent, PaymentRefundSettingComponent],
  imports: [
    PaymentRefundSettingRoutingModule,
    OrganizationSharedModeule,
    AlertPopupModuleModule,
    AppErrorModuleModule,
    CommonModule,
  ],
  exports:[PrefrencesComponent, CustomFieldComponent, PaymentRefundSettingComponent]
})
export class PaymentRefundSettingModuleModule { }
