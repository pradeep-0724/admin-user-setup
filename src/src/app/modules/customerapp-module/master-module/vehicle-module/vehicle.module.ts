
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleRoutingModule } from './vehicle-routing.module';
import { NgxPermissionsModule } from 'ngx-permissions';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    VehicleRoutingModule,
    NgxPermissionsModule.forChild(),
  ],
})
export class VehicleModule { }
