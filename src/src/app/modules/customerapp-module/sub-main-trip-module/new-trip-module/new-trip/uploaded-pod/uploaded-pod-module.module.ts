import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploaderModule } from 'src/app/modules/customerapp-module/file-uploader-module/file-uploader-module.module';
import { UploadedPodComponent } from './uploaded-pod.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [UploadedPodComponent],
  imports: [
    CommonModule,
    FileUploaderModule,
    ReactiveFormsModule
  ],
  exports:[UploadedPodComponent]
})
export class UploadedPodModule { }
