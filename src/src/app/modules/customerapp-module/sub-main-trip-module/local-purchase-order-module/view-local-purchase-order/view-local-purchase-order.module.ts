import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewLocalPurchaseOrderRoutingModule } from './view-local-purchase-order-routing.module';
import { LocalPurchaseOrderViewComponent } from './local-purchase-order-view/local-purchase-order-view.component';
import { FileDeleteViewModule } from '../../new-trip-v2/new-trip-details-v2/file-delete-view-module/file-delete-view-module.module';
import { DateFormaterModule } from '../../../date-formater/date-formater.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { MatTabsModule } from '@angular/material/tabs';
import { LpoPdfViewComponent } from '../lpo-pdf-view/lpo-pdf-view.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AddEmailPopupModule } from '../../../add-email-popup-module/add-email-popup-module.module';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { ListModuleV2 } from '../../new-trip-v2/list-module-v2/list-module-v2.module';


@NgModule({
  declarations: [
    LocalPurchaseOrderViewComponent,
    LpoPdfViewComponent
  ],
  imports: [
    CommonModule,
    ViewLocalPurchaseOrderRoutingModule,
    CommonModule,
    FileDeleteViewModule,
    DateFormaterModule,
    MatTabsModule,
    PdfViewerModule,
    AddEmailPopupModule,
    MatIconModule,
    SharedModule,
    ListModuleV2,
    NgxPermissionsModule.forChild(),
  ]
})
export class ViewLocalPurchaseOrderModule { }
