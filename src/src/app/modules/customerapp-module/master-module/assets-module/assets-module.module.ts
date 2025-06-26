import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetsModuleRoutingModule } from './assets-module-routing.module';
import { NgxPermissionsModule } from 'ngx-permissions';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AssetsModuleRoutingModule,
    NgxPermissionsModule.forChild(),
  ]
})
export class AssetsModuleModule { }
