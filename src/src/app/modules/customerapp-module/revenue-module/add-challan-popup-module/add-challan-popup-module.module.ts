import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { AddChallanComponent } from './add-challan/add-challan.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { MaterialDropDownModule } from '../../material-drop-down-module/material-drop-down-module.module';



@NgModule({
  declarations: [AddChallanComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    AlertPopupModuleModule,
    AppErrorModuleModule,
    MaterialDropDownModule
  ],
  exports:[AddChallanComponent]
})
export class AddChallanPopupModule { }
