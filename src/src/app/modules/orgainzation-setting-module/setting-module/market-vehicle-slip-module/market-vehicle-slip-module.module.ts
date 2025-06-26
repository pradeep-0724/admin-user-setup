import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarketVehicleSlipModuleRoutingModule } from './market-vehicle-slip-module-routing.module';
import { MarketVehicleSlipSettingsComponent } from './market-vehicle-slip-settings/market-vehicle-slip-settings.component';
import { MarketVehicleSlipCustomFieldComponent } from './market-vehicle-slip-custom-field/market-vehicle-slip-custom-field.component';
import { MarketVehicleSlipPreferencesComponent } from './market-vehicle-slip-preferences/market-vehicle-slip-preferences.component';
import { OrganizationSharedModeule } from '../organization-shared-modeule/organization-shared-modeule.module';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';

@NgModule({
  declarations: [MarketVehicleSlipSettingsComponent, MarketVehicleSlipCustomFieldComponent, MarketVehicleSlipPreferencesComponent],
  imports: [
    CommonModule,
    MarketVehicleSlipModuleRoutingModule,
    OrganizationSharedModeule,
    AlertPopupModuleModule,
    AppErrorModuleModule,
  ]
})
export class MarketVehicleSlipModuleModule { }
