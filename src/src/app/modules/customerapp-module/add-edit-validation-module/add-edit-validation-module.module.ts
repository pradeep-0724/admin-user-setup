import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditValidationComponent } from './add-edit-validation/add-edit-validation.component';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '@angular/cdk/dialog';



@NgModule({
  declarations: [
    AddEditValidationComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    DialogModule
  ],
  exports:[AddEditValidationComponent]
})
export class AddEditValidationModule { }
