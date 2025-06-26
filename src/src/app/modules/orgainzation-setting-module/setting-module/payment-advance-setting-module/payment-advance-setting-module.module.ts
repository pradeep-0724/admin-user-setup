import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrefrencesComponent } from './prefrences/prefrences.component';
import { CustomFieldComponent } from './custom-field/custom-field.component';
import { PaymentAdvanceSettingComponent } from './payment-advance-setting.component';
import { PaymentAdvanceSettingRoutingModule } from './payment-advance-setting-module-routing.module';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { OrganizationSharedModeule } from '../organization-shared-modeule/organization-shared-modeule.module';

@NgModule({
  declarations: [PrefrencesComponent, CustomFieldComponent, PaymentAdvanceSettingComponent],
  imports: [
    PaymentAdvanceSettingRoutingModule,
    OrganizationSharedModeule,
    AlertPopupModuleModule,
    AppErrorModuleModule,
    CommonModule,
    
  ],
  exports:[PrefrencesComponent, CustomFieldComponent, PaymentAdvanceSettingComponent]
})
export class PaymentAdvanceSettingModuleModule { }
