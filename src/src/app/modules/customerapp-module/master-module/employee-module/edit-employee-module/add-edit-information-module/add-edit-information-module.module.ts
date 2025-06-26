import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddEditInformationModuleRoutingModule } from './add-edit-information-module-routing.module';
import { EmployeeInformationComponent } from './edit-information/edit-information.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { FileUploaderModule } from 'src/app/modules/customerapp-module/file-uploader-module/file-uploader-module.module';
import { MaterialDropDownModule } from 'src/app/modules/customerapp-module/material-drop-down-module/material-drop-down-module.module';
import { ProfilePicModule } from 'src/app/modules/customerapp-module/profile-pic-module/profile-pic-module.module';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';


@NgModule({
  declarations: [EmployeeInformationComponent],
  imports: [
    CommonModule,
    AddEditInformationModuleRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    AlertPopupModuleModule,
    AppErrorModuleModule,
    MatInputModule,
    SharedModule,
    FileUploaderModule,
    ProfilePicModule,
    MaterialDropDownModule,
    MatMomentDateModule
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
})
export class AddEditInformationModule{ }
