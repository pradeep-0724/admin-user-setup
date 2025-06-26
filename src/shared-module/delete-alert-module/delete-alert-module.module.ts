import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteAlertComponent } from './delete-alert/delete-alert.component';
import { DialogModule } from '@angular/cdk/dialog';



@NgModule({
  declarations: [
    DeleteAlertComponent
  ],
  imports: [
    CommonModule,
    DialogModule,
  ],
  exports:[DeleteAlertComponent]
})
export class DeleteAlertModule { }
