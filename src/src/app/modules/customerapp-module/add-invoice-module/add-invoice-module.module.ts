import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { MaterialDropDownModule } from '../material-drop-down-module/material-drop-down-module.module';
import { AddInvoiceChallanComponent } from './add-invoice-challan/add-invoice-challan.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChallanListFilterPipe } from './challan-list.pipe';



@NgModule({
  declarations: [AddInvoiceChallanComponent,ChallanListFilterPipe],
  imports: [
    CommonModule,
    AlertPopupModuleModule,
    AppErrorModuleModule,
    MaterialDropDownModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports:[AddInvoiceChallanComponent]

})
export class AddInvoiceModule { }
