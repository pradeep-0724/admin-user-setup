import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvancePaymentListDetailsModuleRoutingModule } from './advance-payment-list-details-module-routing.module';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { DetailsAdvancedReceivedComponent } from './details-advanced-received/details-advanced-received.component';
import { AdvanceListComponent } from './advance-component/advance.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { AddEmailPopupModule } from 'src/app/modules/customerapp-module/add-email-popup-module/add-email-popup-module.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { GoThroughModule } from 'src/app/modules/customerapp-module/go-through/go-through.module';
import { ListModuleV2 } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';


@NgModule({
  declarations: [AdvanceListComponent,DetailsAdvancedReceivedComponent,

  ],
  imports: [
    CommonModule,
    AdvancePaymentListDetailsModuleRoutingModule,
    FormsModule,
    SharedModule,
    GoThroughModule,
    NgxPaginationModule,
    AddEmailPopupModule,
    PdfViewerModule,
    ListModuleV2,
    NgxPermissionsModule.forChild(),
    MatIconModule
  ]
})
export class AdvancePaymentListDetailsModule { }
