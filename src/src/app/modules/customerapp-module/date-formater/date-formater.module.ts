import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormateDatePipe } from './formate-date.pipe';



@NgModule({
  declarations: [
    FormateDatePipe
  ],
  imports: [
    CommonModule
  ],
  exports:[FormateDatePipe]
})
export class DateFormaterModule { }
