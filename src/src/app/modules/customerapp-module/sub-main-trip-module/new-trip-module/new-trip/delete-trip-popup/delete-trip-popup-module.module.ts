import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { DeleteTripPopupComponent } from './delete-trip-popup.component';



@NgModule({
  declarations: [DeleteTripPopupComponent],
  imports: [
    CommonModule,
    AlertPopupModuleModule,
  ],
  exports:[DeleteTripPopupComponent]
})
export class DeleteTripPopupModule { }
