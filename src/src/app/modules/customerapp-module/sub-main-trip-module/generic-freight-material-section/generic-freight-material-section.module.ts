import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  AddMaterialPopup, GenericFreightMaterialSectionComponent } from './generic-freight-material-section/generic-freight-material-section.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { MaterialDropDownModule } from '../../material-drop-down-module/material-drop-down-module.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [
    GenericFreightMaterialSectionComponent,
    AddMaterialPopup
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    MaterialDropDownModule,
    NgMultiSelectDropDownModule,
    MatDialogModule,
    CommonModule
  ],
  exports : [GenericFreightMaterialSectionComponent]
})
export class GenericFreightMaterialSectionModule { }
