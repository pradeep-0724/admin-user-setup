import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { GoThroughComponent } from './go-through.component';



@NgModule({
  declarations: [GoThroughComponent],
  imports: [
    CommonModule,
    MatIconModule,

  ],
  exports:[GoThroughComponent]
})
export class GoThroughModule { }
