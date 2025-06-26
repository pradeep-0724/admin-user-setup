import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { MaterialDropDownModule } from '../../../material-drop-down-module/material-drop-down-module.module';
import { AddItemComponent } from './add-item/add-item.component';
import { SharedModule } from 'src/app/shared-module/shared.module';



@NgModule({
  declarations: [AddItemComponent],
  imports: [
    CommonModule,
    AlertPopupModuleModule,
    AppErrorModuleModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    MaterialDropDownModule
  ],
  exports:[AddItemComponent]
})
export class AddItemModule { }
