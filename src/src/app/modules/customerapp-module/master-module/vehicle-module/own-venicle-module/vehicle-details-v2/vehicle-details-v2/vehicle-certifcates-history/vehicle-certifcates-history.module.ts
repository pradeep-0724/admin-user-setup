import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleCertifcatesHistoryComponent } from './vehicle-certifcates-history/vehicle-certifcates-history.component';
import { ViewUploadedDocumentModule } from 'src/app/modules/orgainzation-setting-module/organiation-profile-v2/view-uploaded-document/view-uploaded-document.module';



@NgModule({
  declarations: [
    VehicleCertifcatesHistoryComponent
  ],
  imports: [
    CommonModule,
    ViewUploadedDocumentModule
  ],
  exports :[VehicleCertifcatesHistoryComponent]
})
export class VehicleCertifcatesHistoryModule { }
