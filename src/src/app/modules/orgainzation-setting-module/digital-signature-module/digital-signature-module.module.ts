import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DigitalSignatureModuleRoutingModule } from './digital-signature-module-routing.module';
import { DigitalSignatureListComponent } from './digital-signature-list/digital-signature-list.component';
import { DigitalSignatureAddEditComponent } from './digital-signature-add-edit/digital-signature-add-edit.component';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import { NgxPaginationModule } from 'ngx-pagination';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { ViewUploadedDocumentModule } from '../organiation-profile-v2/view-uploaded-document/view-uploaded-document.module';


@NgModule({
  declarations: [DigitalSignatureListComponent, DigitalSignatureAddEditComponent],
  imports: [
    CommonModule,
    DigitalSignatureModuleRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgxPaginationModule,
    MatTableModule,
    MatSelectModule,
    ImageCropperModule,
    ViewUploadedDocumentModule
  ]
})
export class DigitalSignatureModule { }
