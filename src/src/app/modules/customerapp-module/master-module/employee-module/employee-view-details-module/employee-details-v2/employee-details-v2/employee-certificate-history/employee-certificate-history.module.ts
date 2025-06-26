import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeCertificateHistoryComponent } from './employee-certificate-history/employee-certificate-history.component';
import { ViewUploadedDocumentModule } from 'src/app/modules/orgainzation-setting-module/organiation-profile-v2/view-uploaded-document/view-uploaded-document.module';



@NgModule({
  declarations: [
    EmployeeCertificateHistoryComponent
  ],
  imports: [
    CommonModule,
    ViewUploadedDocumentModule
  ],
  exports:[
    EmployeeCertificateHistoryComponent
  ]
})
export class EmployeeCertificateHistoryModule { }
