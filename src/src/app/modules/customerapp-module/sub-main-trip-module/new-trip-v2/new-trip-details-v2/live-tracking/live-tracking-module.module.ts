import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiveTrackingComponent } from './live-tracking.component';
import { DialogModule } from '@angular/cdk/dialog';
import { GoogleMapsModule } from '@angular/google-maps';



@NgModule({
  declarations: [LiveTrackingComponent,
  ],
  imports: [
    CommonModule,
    DialogModule,
    GoogleMapsModule 
  ],
  exports:[LiveTrackingComponent]
})
export class LiveTrackingModule{ }
