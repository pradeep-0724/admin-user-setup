import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverExpiryComponent } from './driver-expiry.component';



@NgModule({
  declarations: [
    DriverExpiryComponent
  ],

  imports: [
    CommonModule
  ]
  ,exports:[DriverExpiryComponent]
})
export class DriverExpiryModule{ }
