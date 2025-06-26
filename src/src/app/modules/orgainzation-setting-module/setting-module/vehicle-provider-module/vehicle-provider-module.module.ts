import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehicleProviderModuleRoutingModule } from './vehicle-provider-module-routing.module';
import { VehicleProviderSettingComponent } from './vehicle-provider-setting.component';
import { CustomFieldComponent } from './custom-field/custom-field.component';
import { PrefrencesComponent } from './prefrences/prefrences.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [VehicleProviderSettingComponent, CustomFieldComponent, PrefrencesComponent],
  imports: [
    CommonModule,
    VehicleProviderModuleRoutingModule,
    FormsModule
  ]
})
export class VehicleProviderModuleModule { }
