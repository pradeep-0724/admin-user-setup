import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'src/app/shared-module/shared.module';

import { DateAdapter } from 'angular-calendar';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { DialogModule } from '@angular/cdk/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { NgxPermissionsModule } from 'ngx-permissions';
import { FileUploaderV2Module } from '../sub-main-trip-module/new-trip-v2/file-uploader-v2-module/file-uploader-module.module';
import { FileDeleteViewModule } from '../sub-main-trip-module/new-trip-v2/new-trip-details-v2/file-delete-view-module/file-delete-view-module.module';
import { ViewUploadedDocumentModule } from 'src/app/modules/orgainzation-setting-module/organiation-profile-v2/view-uploaded-document/view-uploaded-document.module';
import { GenericInspectionChecklistComponent } from './generic-inspection-checklist.component';
import { AddInspectionPopupComponent } from './add-inspection-popup/add-inspection-popup.component';


@NgModule({
  declarations: [
    GenericInspectionChecklistComponent,
    AddInspectionPopupComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatMomentDateModule,
    FileUploaderV2Module,
    FileDeleteViewModule,
    DialogModule,
    ViewUploadedDocumentModule,
    MatButtonModule, MatMenuModule,
    MatRadioModule,
    NgxPermissionsModule.forChild()
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
  exports : [GenericInspectionChecklistComponent,AddInspectionPopupComponent]
})
export class GenericInspectionModule { }
