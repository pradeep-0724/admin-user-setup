import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';
import { DocumentService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/document.service';
import { GeneralService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/general.service';



@NgModule({
  declarations: [FileUploaderComponent],
  imports: [
    CommonModule
  ],
  exports:[FileUploaderComponent],
  providers: [
    DocumentService, GeneralService
] 
})
export class FileUploaderModule{ }
