import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IllustrationComponent } from './illustration/illustration.component';



@NgModule({
  declarations: [IllustrationComponent],
  imports: [
    CommonModule
  ],
  exports:[IllustrationComponent]
})
export class IllustrationModule { }
