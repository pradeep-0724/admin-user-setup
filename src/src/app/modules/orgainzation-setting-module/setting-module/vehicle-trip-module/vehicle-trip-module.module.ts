import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehicleTripModuleRoutingModule } from './vehicle-trip-module-routing.module';
import { VehicleTripSettingComponent } from './vehicle-trip-setting.component';
import { VehicleTripSettingCustomFiledsComponent } from './vehicle-trip-setting-custom-fileds/vehicle-trip-setting-custom-fileds.component';
import { VehicleTripSettingPreferencesComponent } from './vehicle-trip-setting-preferences/vehicle-trip-setting-preferences.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrganizationSharedModeule } from '../organization-shared-modeule/organization-shared-modeule.module';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { AddBiltySetComponent } from './add-bilty-set/add-bilty-set.component';
import { MaterialDropDownModule } from '../../../customerapp-module/material-drop-down-module/material-drop-down-module.module';
import { TripApprovalComponent } from './trip-approval/trip-approval.component';
import { TripValidationComponent } from './trip-validation/trip-validation.component';

@NgModule({
  declarations: [VehicleTripSettingComponent, VehicleTripSettingCustomFiledsComponent, 
    VehicleTripSettingPreferencesComponent,AddBiltySetComponent, TripApprovalComponent,
    TripValidationComponent],
  imports: [
    CommonModule,
    VehicleTripModuleRoutingModule,
    OrganizationSharedModeule,
    AlertPopupModuleModule,
    AppErrorModuleModule,
    FormsModule,
    MaterialDropDownModule,
    ReactiveFormsModule
  ]
})
export class VehicleTripModuleModule { }
