import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { MaterialDropDownModule } from 'src/app/modules/customerapp-module/material-drop-down-module/material-drop-down-module.module';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { AddAdditionalChargePopupComponent } from './add-additional-charge-popup.component';
import { MatRadioModule } from '@angular/material/radio';
import { AddNewCoaModule } from '../../../chart-of-account-module/add-new-coa-module/add-new-coa-module.module';



@NgModule({
  declarations: [AddAdditionalChargePopupComponent],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MaterialDropDownModule,
    AppErrorModuleModule,
    MatRadioModule,
    MatCheckboxModule,
    AddNewCoaModule
  ],
  exports:[AddAdditionalChargePopupComponent]
})
export class AddAdditionalChargePopupModule { }
