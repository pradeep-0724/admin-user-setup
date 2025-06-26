import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentVendorAdvanceSettingModuleRoutingModule } from './payment-vendor-advance-setting-module-routing.module';
import { PaymentVendorSettingComponent } from './payment-vendor-setting.component';
import { PaymentVendorCustomFieldComponent } from './payment-vendor-custom-field/payment-vendor-custom-field.component';
import { PaymentVendorPreferencesComponent } from './payment-vendor-preferences/payment-vendor-preferences.component';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { OrganizationSharedModeule } from '../organization-shared-modeule/organization-shared-modeule.module';

@NgModule({
  declarations: [PaymentVendorSettingComponent, PaymentVendorCustomFieldComponent, PaymentVendorPreferencesComponent],
  imports: [
    CommonModule,
    PaymentVendorAdvanceSettingModuleRoutingModule,
    OrganizationSharedModeule,
    AlertPopupModuleModule,
    AppErrorModuleModule,
  ]
})
export class PaymentVendorAdvanceSettingModuleModule { }
