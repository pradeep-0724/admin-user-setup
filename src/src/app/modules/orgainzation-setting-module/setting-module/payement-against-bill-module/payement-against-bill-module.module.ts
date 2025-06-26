import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayementAgainstBillModuleRoutingModule } from './payement-against-bill-module-routing.module';
import { PaymentAgainstCustomFieldComponent } from './payment-against-custom-field/payment-against-custom-field.component';
import { PaymentAgainstPreferencesComponent } from './payment-against-preferences/payment-against-preferences.component';
import { PaymentAgainstSettingsComponent } from './payment-against-settings.component';
import { OrganizationSharedModeule } from '../organization-shared-modeule/organization-shared-modeule.module';

@NgModule({
  declarations: [PaymentAgainstCustomFieldComponent, PaymentAgainstPreferencesComponent, PaymentAgainstSettingsComponent],
  imports: [
    CommonModule,
    PayementAgainstBillModuleRoutingModule,
    OrganizationSharedModeule
  ]
})
export class PayementAgainstBillModuleModule { }
