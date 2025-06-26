import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DeleteTripPopupModule } from '../delete-trip-popup/delete-trip-popup-module.module';
import { EditTripNewPopUpModule } from '../edit-trip-new-pop-up/edit-trip-new-pop-up-module.module';
import { NewTripPopupAddModule } from '../new-trip-popup-add/new-trip-popup-add-module.module';
import { ChargesPopupComponent } from './charges-popup.component';



@NgModule({
  declarations: [ChargesPopupComponent],
  imports: [
    CommonModule,
    DeleteTripPopupModule,
    EditTripNewPopUpModule,
    NewTripPopupAddModule,
    MatIconModule
  ],
  exports:[ChargesPopupComponent]
})
export class ChargesPopupModule { }
