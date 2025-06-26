import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { MaterialDropDownModule } from '../../material-drop-down-module/material-drop-down-module.module';
import { AddressComponent } from './address/address.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [AddressComponent],
  imports: [
    CommonModule,
    AlertPopupModuleModule,
    AppErrorModuleModule,
    MaterialDropDownModule,
    ReactiveFormsModule,

  ],
  exports:[AddressComponent]
})
export class AddAddressModule { }
