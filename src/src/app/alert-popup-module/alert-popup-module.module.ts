import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertPopupComponent } from './alert-popup/alert-popup.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [AlertPopupComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports:[AlertPopupComponent]
})
export class AlertPopupModuleModule { }
