import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditAddressModuleRoutingModule } from './add-edit-address-module-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { FileUploaderModule } from 'src/app/modules/customerapp-module/file-uploader-module/file-uploader-module.module';
import { MaterialDropDownModule } from 'src/app/modules/customerapp-module/material-drop-down-module/material-drop-down-module.module';
import { EmployeeAddressComponent } from './employee-address/edit-address.component';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';


@NgModule({
  declarations: [EmployeeAddressComponent],
  imports: [
    CommonModule,
    AddEditAddressModuleRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    AlertPopupModuleModule,
    AppErrorModuleModule,
    SharedModule,
    MatInputModule,
    FileUploaderModule,
    MaterialDropDownModule,
    MatMomentDateModule
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
})
export class AddEditAddressModule{ }
