import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddExpenseItemComponent } from './add-expense-item/add-expense-item.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { MaterialDropDownModule } from '../material-drop-down-module/material-drop-down-module.module';



@NgModule({
  declarations: [AddExpenseItemComponent],
  imports: [
    CommonModule,
    AppErrorModuleModule,
    MaterialDropDownModule,
    ReactiveFormsModule
  ],
  exports:[AddExpenseItemComponent]
})
export class AddExpenseItemPopupModule { }
