import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermitModuleRoutingModule } from './permit-module-routing.module';
import { NgxPermissionsModule } from 'ngx-permissions';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PermitModuleRoutingModule,
    NgxPermissionsModule.forChild(),
  ]
})
export class PermitModuleModule { }
