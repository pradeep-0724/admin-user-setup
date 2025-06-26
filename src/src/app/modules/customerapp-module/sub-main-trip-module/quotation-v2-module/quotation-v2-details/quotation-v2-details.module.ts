import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuotationV2DetailsRoutingModule } from './quotation-v2-details-routing.module';
import { QuotationV2DetailsComponent } from './quotation-v2-details/quotation-v2-details.component';
import { QuotationV2HeaderSectionComponent } from './quotation-v2-header-section/quotation-v2-header-section.component';
import { QuotationV2RouteSectionComponent } from './quotation-v2-route-section/quotation-v2-route-section.component';
import { QuotationV2BillingSectionComponent } from './quotation-v2-billing-section/quotation-v2-billing-section.component';
import { QuotationV2TermsConditionSectionComponent } from './quotation-v2-terms-condition-section/quotation-v2-terms-condition-section.component';
import { QuotationV2CalculationSectionComponent } from './quotation-v2-calculation-section/quotation-v2-calculation-section.component';
import { QuotationV2PdfComponent } from './quotation-v2-pdf/quotation-v2-pdf.component';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxPermissionsModule } from 'ngx-permissions';
import { AddEmailPopupModule } from '../../../add-email-popup-module/add-email-popup-module.module';
import { QuotationCommentsComponent } from './quotation-comments/quotation-comments.component';
import { NgxEditorModule } from 'ngx-editor';
import { TripV2StatusModule } from '../../new-trip-v2/trip-v2-status/trip-v2-status.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DateAdapter, MatRippleModule } from '@angular/material/core';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { QuotationV2TncContentComponent } from './quotation-v2-tnc-content/quotation-v2-tnc-content.component';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { NewQuotationV2CraneHeaderComponent } from './new-quotation-v2/new-quotation-v2-crane-header/new-quotation-v2-crane-header.component';
import { NewQuotationV2CraneChargeSectionComponent } from './new-quotation-v2/new-quotation-v2-crane-charge-section/new-quotation-v2-crane-charge-section.component';
import { NewQuotationV2CraneBalanceTermsComponent } from './new-quotation-v2/new-quotation-v2-crane-balance-terms/new-quotation-v2-crane-balance-terms.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuotationV2EditRequestPopupComponent } from './new-quotation-v2/quotation-v2-edit-request-popup/quotation-v2-edit-request-popup.component';
import { QuotationV2VoidPopupComponent } from './new-quotation-v2/quotation-v2-void-popup/quotation-v2-void-popup.component';
import { QuotationV2ApproveRejectPopupComponent } from './new-quotation-v2/quotation-v2-approve-reject-popup/quotation-v2-approve-reject-popup.component';
import { QuotationV2ViewApprovalDetailsComponent } from './new-quotation-v2/quotation-v2-view-approval-details/quotation-v2-view-approval-details.component';
import { NewQuotationV2StatusBlockComponent } from './new-quotation-v2-status-block/new-quotation-v2-status-block.component';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { EditRequestModule } from '../../../edit-request-module/edit-request-module.module';
import { AddTripV2DocumentsExpiryModule } from '../../new-trip-v2/add-trip-v2/add-trip-v2-documents-expiry/add-trip-v2-documents-expiry.module';
import { NewQuotationV2TrailerChargeSectionComponent } from './new-quotation-v2/new-quotation-v2-trailer-charge-section/new-quotation-v2-trailer-charge-section.component';
import { NewQuotationV2TrailerBillingCalculationComponent } from './new-quotation-v2/new-quotation-v2-trailer-billing-calculation/new-quotation-v2-trailer-billing-calculation.component';
import { FileUploaderV2Module } from '../../new-trip-v2/file-uploader-v2-module/file-uploader-module.module';
import { FileDeleteViewModule } from '../../new-trip-v2/new-trip-details-v2/file-delete-view-module/file-delete-view-module.module';


@NgModule({
  declarations: [
    QuotationV2DetailsComponent,
    QuotationV2HeaderSectionComponent,
    QuotationV2RouteSectionComponent,
    QuotationV2BillingSectionComponent,
    QuotationV2TermsConditionSectionComponent,
    QuotationV2CalculationSectionComponent,
    QuotationV2PdfComponent,
    QuotationCommentsComponent,
    QuotationV2TncContentComponent,
    NewQuotationV2CraneHeaderComponent,
    NewQuotationV2CraneChargeSectionComponent,
    NewQuotationV2CraneBalanceTermsComponent,
    QuotationV2EditRequestPopupComponent,
    QuotationV2VoidPopupComponent,
    QuotationV2ApproveRejectPopupComponent,
    QuotationV2ViewApprovalDetailsComponent,
    NewQuotationV2StatusBlockComponent,
    NewQuotationV2TrailerChargeSectionComponent,
    NewQuotationV2TrailerBillingCalculationComponent,
    
  ],
  imports: [
    CommonModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    QuotationV2DetailsRoutingModule,
    MatInputModule,
    NgxPermissionsModule.forChild(),
    MatIconModule,
    PdfViewerModule,
    FileUploaderV2Module,
    FileDeleteViewModule,
    AddEmailPopupModule,
    SharedModule,
    NgxEditorModule,
    MatTabsModule,
    TripV2StatusModule,
    MatCheckboxModule,
    MatRippleModule,
    MatTooltipModule,
    EditRequestModule,
    AddTripV2DocumentsExpiryModule,
    MatButtonModule, MatMenuModule
  ],
  providers:[{ provide: DateAdapter, useClass: AppDateAdapter }],
})
export class QuotationV2DetailsModule { }
