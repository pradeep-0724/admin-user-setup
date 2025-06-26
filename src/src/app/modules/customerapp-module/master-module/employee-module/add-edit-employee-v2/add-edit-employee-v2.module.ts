import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditEmployeeV2Component } from './add-edit-employee-v2/add-edit-employee-v2.component';
import { AddEditEmployeeV2RoutingModule } from './add-edit-employee-v2-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialDropDownModule } from '../../../material-drop-down-module/material-drop-down-module.module';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { ProfilePicModule } from '../../../profile-pic-module/profile-pic-module.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { FileUploaderModule } from '../../../file-uploader-module/file-uploader-module.module';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { EmployeeDocumentComponent } from './employee-document-v2/edit-document.component';
import { EmployeeSharedModuleModule } from '../employee-shared-module/employee-shared-module.module';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { FileDeleteViewModule } from '../../../sub-main-trip-module/new-trip-v2/new-trip-details-v2/file-delete-view-module/file-delete-view-module.module';
import { FileUploaderV2Module } from '../../../sub-main-trip-module/new-trip-v2/file-uploader-v2-module/file-uploader-module.module';
import { MatTabsModule } from '@angular/material/tabs';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AddEditDocumentV2Component } from './add-edit-document-v2/add-edit-document-v2.component';
import { AddPartyPopupModule } from '../../party-module/add-party-popup-module/add-party-popup-module.module';



@NgModule({
  declarations: [
    AddEditEmployeeV2Component,
    EmployeeDocumentComponent,
    AddEditDocumentV2Component
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MaterialDropDownModule,
    AppErrorModuleModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    AlertPopupModuleModule,
    SharedModule,
    FileUploaderModule,
    ProfilePicModule,
    MaterialDropDownModule,
    MatMomentDateModule,
    AddEditEmployeeV2RoutingModule,
    EmployeeSharedModuleModule,
    FileDeleteViewModule,
    FileUploaderV2Module,
    AddPartyPopupModule,
    MatTabsModule,
    NgMultiSelectDropDownModule,
    NgMultiSelectDropDownModule.forRoot(),
    CommonModule
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],

})
export class AddEditEmployeeV2Module { }
