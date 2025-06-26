import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewTripV2RoutingModule } from './new-trip-v2-routing.module';
import { NgxPermissionsModule } from 'ngx-permissions';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NewTripV2RoutingModule,
    NgxPermissionsModule.forChild(),
  ]
})
export class NewTripV2Module { }
