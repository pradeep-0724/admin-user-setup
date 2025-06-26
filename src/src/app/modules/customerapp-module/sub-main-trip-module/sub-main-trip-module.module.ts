import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubMainTripModuleRoutingModule } from './sub-main-trip-module-routing.module';
import { NgxPermissionsModule } from 'ngx-permissions';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SubMainTripModuleRoutingModule,
    NgxPermissionsModule.forChild(),
  ]
})
export class SubMainTripModule{ }
