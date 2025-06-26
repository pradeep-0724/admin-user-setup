import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehPaymentDetailsComponent } from './veh-payment-details/veh-payment-details.component';
import { vehPaymentDetailsModuleRoutingModule } from './veh-payment-details-routing.module';
import { VehPaymentDetailsHeaderComponent } from './veh-payment-details-header/veh-payment-details-header.component';
import { VehPaymentPdfViewComponent } from './veh-payment-pdf-view/veh-payment-pdf-view.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SharedModule } from 'src/app/shared-module/shared.module';



@NgModule({
  declarations: [
    VehPaymentDetailsComponent,
    VehPaymentDetailsHeaderComponent,
    VehPaymentPdfViewComponent
  ],
  imports: [
    CommonModule,
    vehPaymentDetailsModuleRoutingModule,
    MatTabsModule,
    MatIconModule,
    SharedModule,
		PdfViewerModule,
    NgxPermissionsModule.forChild(),
  ]
})
export class VehPaymentDetailsModule { }
