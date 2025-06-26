import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteInspectionModuleRoutingModule } from './site-inspection-module-routing.module';
import { NgxPermissionsModule } from 'ngx-permissions';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SiteInspectionModuleRoutingModule,
    NgxPermissionsModule.forChild(),
  ],

})
export class SiteInspectionModuleModule { }
