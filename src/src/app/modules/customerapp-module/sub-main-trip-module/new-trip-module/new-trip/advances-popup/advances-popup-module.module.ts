import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DeleteTripPopupModule } from '../delete-trip-popup/delete-trip-popup-module.module';
import { EditTripNewPopUpModule } from '../edit-trip-new-pop-up/edit-trip-new-pop-up-module.module';
import { AdvancesPopupComponent } from './advances-popup.component';



@NgModule({
  declarations: [AdvancesPopupComponent],
  imports: [
    CommonModule,
    EditTripNewPopUpModule,
    DeleteTripPopupModule,
    MatIconModule

  ],
  exports:[AdvancesPopupComponent]
})
export class AdvancesPopupModule{ }
