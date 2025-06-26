import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EllipsisPipe } from './ellipsis.pipe';
import { RoutePopUpComponent } from './route-pop-up/route-pop-up.component';



@NgModule({
  declarations: [ EllipsisPipe,
    RoutePopUpComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports:[ EllipsisPipe,
    RoutePopUpComponent],
})
export class MultipleDestinationSharedModule{ }
