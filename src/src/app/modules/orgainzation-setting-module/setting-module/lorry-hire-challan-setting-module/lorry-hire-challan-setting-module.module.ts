import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LorryHireChallanSettingModuleRoutingModule } from './lorry-hire-challan-setting-module-routing.module';
import { PrefrencesComponent } from './prefrences/prefrences.component';
import { CustomFieldComponent } from './custom-field/custom-field.component';
import { LorryHireChallanSettingComponent } from './lorry-hire-challan-setting.component';
import { FormsModule } from '@angular/forms';
import { OrganizationSharedModeule } from '../organization-shared-modeule/organization-shared-modeule.module';


@NgModule({
  declarations: [PrefrencesComponent, CustomFieldComponent, LorryHireChallanSettingComponent],
  imports: [
    CommonModule,
    LorryHireChallanSettingModuleRoutingModule,
    OrganizationSharedModeule,
    FormsModule
  ],
  exports:[PrefrencesComponent, CustomFieldComponent, LorryHireChallanSettingComponent]
})
export class LorryHireChallanSettingModuleModule { }
