import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GpsModuleRoutingModule } from './gps-module-routing.module';
import { GpsComponent } from './gps.component';


@NgModule({
  declarations: [
    GpsComponent
  ],
  imports: [
    CommonModule,
    GpsModuleRoutingModule
  ]
})
export class GpsModule { }
