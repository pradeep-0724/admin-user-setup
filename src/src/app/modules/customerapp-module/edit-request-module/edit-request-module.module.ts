import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditRequestComponent } from './edit-request.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '@angular/cdk/dialog';
import { SharedModule } from 'src/app/shared-module/shared.module';



@NgModule({
  declarations: [
    EditRequestComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    SharedModule

  ],
  exports:[EditRequestComponent]
})
export class EditRequestModule { }
