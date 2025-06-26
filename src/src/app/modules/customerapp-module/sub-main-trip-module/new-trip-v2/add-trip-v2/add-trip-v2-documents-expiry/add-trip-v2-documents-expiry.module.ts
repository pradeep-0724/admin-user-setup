import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTripV2DocumentsExpiryComponent } from './add-trip-v2-documents-expiry.component';
import { ExpiryDocumentsPopupComponent } from './expiry-documents-popup/expiry-documents-popup.component';
import { DriverExpiryModule } from 'src/app/modules/customerapp-module/driver-expiry-module/driver-expiry-module.module';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [
    AddTripV2DocumentsExpiryComponent,
    ExpiryDocumentsPopupComponent
  ],
  imports: [
    CommonModule,
    DriverExpiryModule,
    RouterModule,
    MatTabsModule
  ],
  exports:[AddTripV2DocumentsExpiryComponent]
})
export class AddTripV2DocumentsExpiryModule { }
