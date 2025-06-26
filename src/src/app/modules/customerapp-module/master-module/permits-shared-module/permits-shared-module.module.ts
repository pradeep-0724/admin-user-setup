import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermitsRenewPopupComponent } from './permits-renew-popup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { DateDropDownModule } from '../vehicle-module/own-venicle-module/vehicle-details-v2/date-drop-down-module/date-drop-down-module.module';
import { FileDeleteViewModule } from '../../sub-main-trip-module/new-trip-v2/new-trip-details-v2/file-delete-view-module/file-delete-view-module.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FileUploaderModule } from '../../file-uploader-module/file-uploader-module.module';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MaterialDropDownModule } from '../../material-drop-down-module/material-drop-down-module.module';
import { MatInputModule } from '@angular/material/input';
import { PermitCertifcatesHistoryComponent } from './permit-certifcates-history/permit-certifcates-history.component';
import { ViewUploadedDocumentModule } from 'src/app/modules/orgainzation-setting-module/organiation-profile-v2/view-uploaded-document/view-uploaded-document.module';

@NgModule({
  declarations: [
    PermitsRenewPopupComponent,PermitCertifcatesHistoryComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppErrorModuleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatAutocompleteModule,
    DateDropDownModule,
    FileDeleteViewModule,
    FileUploaderModule,
    FormsModule,
    MatFormFieldModule,
    MaterialDropDownModule,
    MatInputModule,
    ViewUploadedDocumentModule,
  ],
  exports: [
    PermitsRenewPopupComponent,PermitCertifcatesHistoryComponent
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],


})
export class PermitsSharedModule { }
