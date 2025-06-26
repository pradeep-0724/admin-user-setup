import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoPlayComponent } from './video-play/video-play.component';



@NgModule({
  declarations: [VideoPlayComponent],
  imports: [
    CommonModule
  ],
  exports:[VideoPlayComponent]
})
export class VideoPlayModule { }
