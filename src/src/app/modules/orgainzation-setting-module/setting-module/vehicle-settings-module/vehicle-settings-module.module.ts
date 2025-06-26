import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehicleSettingsModuleRoutingModule } from './vehicle-settings-module-routing.module';
import { VehicleSettingsComponent } from './vehicle-settings.component';
import { PrefrenceComponent } from './prefrence/prefrence.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VehiclePermitListComponent } from './vehicle-permit-list/vehicle-permit-list.component';
import { VehicleAddEditPermitComponent } from './vehicle-add-edit-permit/vehicle-add-edit-permit.component';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MaterialDropDownModule } from 'src/app/modules/customerapp-module/material-drop-down-module/material-drop-down-module.module';
import { MatRadioModule } from '@angular/material/radio';


@NgModule({
  declarations: [
    VehicleSettingsComponent,
    PrefrenceComponent,
    VehiclePermitListComponent,
    VehicleAddEditPermitComponent
  ],
  imports: [
    CommonModule,
    VehicleSettingsModuleRoutingModule,
    ReactiveFormsModule,
    MatRadioModule,
    FormsModule,
    AppErrorModuleModule,
    MatCheckboxModule,
    AlertPopupModuleModule,
    MaterialDropDownModule,
    NgxPermissionsModule.forChild(),
  ]
})
export class VehicleSettingsModuleModule { }
