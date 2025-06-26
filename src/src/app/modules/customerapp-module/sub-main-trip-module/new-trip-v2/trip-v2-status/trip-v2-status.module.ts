import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripV2StatusComponent } from './trip-v2-status.component';
import { CarouselModule } from 'ngx-owl-carousel-o';



@NgModule({
  declarations: [
    TripV2StatusComponent
  ],
  imports: [
    CommonModule,
    CarouselModule
  ],
  exports:[TripV2StatusComponent]
})
export class TripV2StatusModule { }
