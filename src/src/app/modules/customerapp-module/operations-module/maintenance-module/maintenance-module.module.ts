import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaintenanceModuleRoutingModule } from './maintenance-module-routing.module';
import { NgxPermissionsModule } from 'ngx-permissions';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    MaintenanceModuleRoutingModule,
    NgxPermissionsModule.forChild(),
    
  ]
})
export class MaintenanceModule{ }
