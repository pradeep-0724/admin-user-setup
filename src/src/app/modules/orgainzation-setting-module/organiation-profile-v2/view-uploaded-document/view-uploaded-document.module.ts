import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewUploadedDocumentComponent } from './view-uploaded-document.component';
import { FileDeleteViewModule } from '../../../customerapp-module/sub-main-trip-module/new-trip-v2/new-trip-details-v2/file-delete-view-module/file-delete-view-module.module';



@NgModule({
  declarations: [
    ViewUploadedDocumentComponent
  ],
  imports: [
    CommonModule,
    FileDeleteViewModule
  ],
  exports: [ViewUploadedDocumentComponent]
})
export class ViewUploadedDocumentModule { }
