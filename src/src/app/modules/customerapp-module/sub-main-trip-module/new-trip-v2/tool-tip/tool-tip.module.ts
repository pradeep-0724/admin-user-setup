import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolTipComponent } from './tool-tip.component';
import { SimpleTooltipComponent } from './simple-tooltip/simple-tooltip.component';
import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
  declarations: [
    ToolTipComponent,
    SimpleTooltipComponent
  ],
  imports: [
    CommonModule,
    MatTooltipModule
  ],
  exports:[ToolTipComponent,SimpleTooltipComponent]
})
export class ToolTipModule { }
