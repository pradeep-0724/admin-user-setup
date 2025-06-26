import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddMarketVehiclePopupComponent } from './add-market-vehicle-popup/add-market-vehicle-popup.component';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialDropDownModule } from '../../../material-drop-down-module/material-drop-down-module.module';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { MatRippleModule } from '@angular/material/core';



@NgModule({
  declarations: [
    AddMarketVehiclePopupComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    MaterialDropDownModule,
    AppErrorModuleModule,
    MatRippleModule
    
  ],
  exports : [AddMarketVehiclePopupComponent]
})
export class AddMarketVehiclePopupModule { }
