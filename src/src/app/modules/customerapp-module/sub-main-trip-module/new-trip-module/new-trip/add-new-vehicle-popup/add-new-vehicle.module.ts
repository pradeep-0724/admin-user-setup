import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AddNewVehiclePopupComponent } from './add-new-vehicle-popup.component';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [AddNewVehiclePopupComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    SharedModule,
    MatIconModule
  ],
  exports:[AddNewVehiclePopupComponent]
})
export class AddNewVehicleModule { }
