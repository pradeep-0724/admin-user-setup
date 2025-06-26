import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditDocumentModuleRoutingModule } from './add-edit-document-module-routing.module';
import { EmployeeDocumentComponent } from './employee-document/edit-document.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { FileUploaderModule } from 'src/app/modules/customerapp-module/file-uploader-module/file-uploader-module.module';
import { MaterialDropDownModule } from 'src/app/modules/customerapp-module/material-drop-down-module/material-drop-down-module.module';
import { EmployeeSharedModuleModule } from '../../employee-shared-module/employee-shared-module.module';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';


@NgModule({
  declarations: [EmployeeDocumentComponent],
  imports: [
    CommonModule,
    AddEditDocumentModuleRoutingModule,
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
    EmployeeSharedModuleModule,
    MatMomentDateModule

  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
})
export class AddEditDocumentModule { }
