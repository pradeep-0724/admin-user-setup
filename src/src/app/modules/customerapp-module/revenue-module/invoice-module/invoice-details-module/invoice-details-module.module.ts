import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceDetailsModuleRoutingModule } from './invoice-details-module-routing.module';
import { InvoiceDetailsComponent } from './invoice-details/invoice-details.component';
import { InvoiceHeaderComponent } from './invoice-header/invoice-header.component';
import { InvoiceDetailsChargesComponent } from './invoice-details-charges/invoice-details-charges.component';
import { InvoiceDetailsDeductionComponent } from './invoice-details-deduction/invoice-details-deduction.component';
import { InvoiceDetailsItemOthersComponent } from './invoice-details-item-others/invoice-details-item-others.component';
import { InvoiceDetailsTermsConditionComponent } from './invoice-details-terms-condition/invoice-details-terms-condition.component';
import { InvoiceDetailsCalculatiosComponent } from './invoice-details-calculatios/invoice-details-calculatios.component';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxPermissionsModule } from 'ngx-permissions';
import { RouterModule } from '@angular/router';
import { InvoicePdfViewComponent } from './invoice-pdf-view/invoice-pdf-view.component';
import { MatDialogModule } from '@angular/material/dialog';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AddEmailPopupModule } from '../../../add-email-popup-module/add-email-popup-module.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { InvoiceHistoryComponent } from './invoice-history/invoice-history.component';
import { InvoiceTimesheetComponent } from './invoice-timesheet/invoice-timesheet.component';
import { ViewUploadedDocumentModule } from 'src/app/modules/orgainzation-setting-module/organiation-profile-v2/view-uploaded-document/view-uploaded-document.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared-module/shared.module';


@NgModule({
  declarations: [
    InvoiceDetailsComponent,
    InvoiceHeaderComponent,
    InvoiceDetailsChargesComponent,
    InvoiceDetailsDeductionComponent,
    InvoiceDetailsItemOthersComponent,
    InvoiceDetailsTermsConditionComponent,
    InvoiceDetailsCalculatiosComponent,
    InvoicePdfViewComponent,
    InvoiceHistoryComponent,
    InvoiceTimesheetComponent
  ],
  imports: [
    CommonModule,
    InvoiceDetailsModuleRoutingModule,
    MatTabsModule,
    RouterModule,
    MatDialogModule,
    FormsModule,
    SharedModule,
    NgxPermissionsModule.forChild(),
    AddEmailPopupModule,
    PdfViewerModule,
    MatCheckboxModule,
    MatIconModule,
    MatMenuModule,
    MatRippleModule,
    ViewUploadedDocumentModule
  ]
})
export class InvoiceDetailsModuleModule { }
