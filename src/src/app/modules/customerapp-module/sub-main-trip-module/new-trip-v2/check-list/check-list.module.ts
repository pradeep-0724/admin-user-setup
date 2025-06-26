import { MaterialDropDownModule } from 'src/app/modules/customerapp-module/material-drop-down-module/material-drop-down-module.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckListComponent } from './check-list/check-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckListSearch } from './check-list.pipe';
import { ToolTipModule } from '../tool-tip/tool-tip.module';



@NgModule({
  declarations: [
    CheckListComponent,CheckListSearch
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialDropDownModule,
    ToolTipModule
  ],
  exports:[CheckListComponent]
})
export class CheckListModule { }
