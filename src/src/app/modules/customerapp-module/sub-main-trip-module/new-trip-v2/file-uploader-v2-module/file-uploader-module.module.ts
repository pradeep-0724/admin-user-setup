import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploaderV2Component } from './file-uploader/file-uploader-v2.component';
import { DocumentService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/document.service';
import { GeneralService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/general.service';



@NgModule({
  declarations: [FileUploaderV2Component],
  imports: [
    CommonModule
  ],
  exports:[FileUploaderV2Component],
  providers: [
    DocumentService, GeneralService
] 
})
export class FileUploaderV2Module{ }
