import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriverAppAccessModuleRoutingModule } from './driver-app-access-module-routing.module';
import { DriverAppAccessManagementComponent } from './driver-app-access-management/driver-app-access-management.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialDropDownModule } from '../../customerapp-module/material-drop-down-module/material-drop-down-module.module';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { MatIconModule } from '@angular/material/icon';
import { ListModuleV2 } from '../../customerapp-module/sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';


@NgModule({
  declarations: [
    DriverAppAccessManagementComponent,
  ],
  imports: [
    CommonModule,
    ListModuleV2,
    ReactiveFormsModule,
    AppErrorModuleModule,
    MaterialDropDownModule,
    FormsModule,
    AlertPopupModuleModule,
    MatIconModule,
    DriverAppAccessModuleRoutingModule
  ]
})
export class DriverAppAccessModule{ }
