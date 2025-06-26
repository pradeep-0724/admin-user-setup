import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditItemMasterModuleRoutingModule } from './add-edit-item-master-module-routing.module';
import { AddEditItemComponent } from './add-edit-item/add-edit-item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { SharedModule } from 'src/app/shared-module/shared.module';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { AddNewCoaModule } from '../../chart-of-account-module/add-new-coa-module/add-new-coa-module.module';


@NgModule({
  declarations: [
    AddEditItemComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    SharedModule,
    MatCheckboxModule,
    MatRippleModule,
    AddNewCoaModule,
    AddEditItemMasterModuleRoutingModule
  ]
})
export class AddEditItemMasterModuleModule { }
