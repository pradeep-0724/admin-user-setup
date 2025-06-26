import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwnVenicleModuleRoutingModule } from './own-venicle-module-routing.module';
import { NgxPermissionsModule } from 'ngx-permissions';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxPermissionsModule.forChild(),
    OwnVenicleModuleRoutingModule,
    
  ]
})
export class OwnVenicleModule { }
