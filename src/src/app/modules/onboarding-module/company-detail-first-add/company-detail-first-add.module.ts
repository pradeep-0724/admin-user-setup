import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyDetailFirstAddRoutingModule } from './company-detail-first-add-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { TaxModuleModule } from 'src/app/tax-module/tax-module.module';
import { CompanyDetailFirstAddComponent } from './company-detail-first-add.component';
import { ProfilePicModule } from '../../customerapp-module/profile-pic-module/profile-pic-module.module';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatTabsModule } from '@angular/material/tabs';
import { CompanyDetailSecondAddModule } from '../company-detail-second-add/company-detail-second-add.module';
import { EditCompanyDocumentComponent } from '../company-documents-v2/edit-company-documents';
import { FileUploaderV2Module } from '../../customerapp-module/sub-main-trip-module/new-trip-v2/file-uploader-v2-module/file-uploader-module.module';
import { FileDeleteViewModule } from '../../customerapp-module/sub-main-trip-module/new-trip-v2/new-trip-details-v2/file-delete-view-module/file-delete-view-module.module';


@NgModule({
  declarations: [CompanyDetailFirstAddComponent,EditCompanyDocumentComponent],
  imports: [
    CommonModule,
    CompanyDetailFirstAddRoutingModule,
    ReactiveFormsModule,
    ProfilePicModule,
    FormsModule,
    MatMomentDateModule,
    FileUploaderV2Module,
    FileDeleteViewModule,
    CompanyDetailSecondAddModule,
    MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule,SharedModule,
    MatSelectModule,TaxModuleModule,
    MatTabsModule
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
  exports:[CompanyDetailFirstAddComponent]
})
export class CompanyDetailFirstAddModule { }
