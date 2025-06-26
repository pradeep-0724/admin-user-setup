import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewTripDetailsV2RoutingModule } from './new-trip-details-v2-routing.module';
import { NewTripDetailsV2Component } from './new-trip-details-v2/new-trip-details-v2.component';
import { TripDetailsHeaderSectionComponent } from './trip-details-header-section/trip-details-header-section.component';
import { TripDetailsStatusSectionComponent } from './trip-details-status-section/trip-details-status-section.component';
import { TripDetailsAddSectionComponent } from './trip-details-add-section/trip-details-add-section.component';
import { TripDetailsSummarySectionComponent } from './trip-details-summary-section/trip-details-summary-section.component';
import { TripDetailsProfitLossSectionComponent } from './trip-details-profit-loss-section/trip-details-profit-loss-section.component';
import { TripDetailsTransactionSectionComponent } from './trip-details-transaction-section/trip-details-transaction-section.component';
import { TripDetailsTripDocumentsSectionComponent } from './trip-details-trip-documents-section/trip-details-trip-documents-section.component';
import { TripDetailsDriverLedgerSectionComponent } from './trip-details-driver-ledger-section/trip-details-driver-ledger-section.component';
import { TripDetailsMapSectionComponent } from './trip-details-map-section/trip-details-map-section.component';
import { TripDestinationDetailsModule } from './trip-destination-details-module/trip-destination-details-module.module';
import { TripV2StatusModule } from '../trip-v2-status/trip-v2-status.module';
import { MatTabsModule } from '@angular/material/tabs';
import { FileUploaderV2Module } from '../file-uploader-v2-module/file-uploader-module.module';
import {DialogModule} from '@angular/cdk/dialog';
import { EditTripHeaderComponent } from './edit-trip-header/edit-trip-header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddFuelComponent } from './add-fuel/add-fuel.component';
import { AddDriverAllowanceComponent } from './add-driver-allowance/add-driver-allowance.component';
import { AddOtherExpensesComponent } from './add-other-expenses/add-other-expenses.component';
import {MatMenuModule} from '@angular/material/menu';
import { RouteEditModule } from './route-edit-module/route-edit-module.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EditBillingModuleV2Module } from './edit-billing-module-v2/edit-billing-module-v2.module';
import { ChargeDeductionComponent } from './charge-deduction/charge-deduction.component';
import { AddPartyPopupModule } from '../../../master-module/party-module/add-party-popup-module/add-party-popup-module.module';
import { ChangeDestinationStatusComponent } from './change-destination-status/change-destination-status.component';
import { ToolTipModule } from '../tool-tip/tool-tip.module';
import { NgxMatDatetimePickerModule } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { FinishTripComponent } from './finish-trip/finish-trip.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SharedModule } from 'src/app/shared-module/shared.module';
import {  AddEditMaterialComponent, AddMaterialPopup } from './add-edit-material/add-edit-material.component';
import { AddItemModule } from '../../../master-module/item-module/add-item-module/add-item-module.module';
import { FileDeleteViewModule } from './file-delete-view-module/file-delete-view-module.module';
import { AddEditAddToInvoiceComponent } from './charge-deduction/add-edit-add-to-invoice/add-edit-add-to-invoice.component';
import { AddEditReduceFromInvoiceComponent } from './charge-deduction/add-edit-reduce-from-invoice/add-edit-reduce-from-invoice.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { MultipleDestinationSharedModule } from '../multiple-destination-shared-module/multiple-destination-shared-module.module';
import { AddEditTripTaskModule } from './add-edit-view-trip-task/add-edit-trip-task-module.module';
import { DeleteAlertModule } from 'src/app/shared-module/delete-alert-module/delete-alert-module.module';
import { EditCustomFieldModule } from './edit-custom-fields/edit-custom-field.module';
import { RouterModule } from '@angular/router';
import { LiveTrackingModule } from './live-tracking/live-tracking-module.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import { DateAndTimeModule } from '../../../date-and-time-module/date-and-time-module.module';
import { GoThroughModule } from '../../../go-through/go-through.module';
import { BdpStatusChangeComponent } from './bdp-status-change/bdp-status-change.component';
import { VehicleChangeComponent } from './vehicle-change/vehicle-change.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DateAdapter, MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MultiDriverModule } from '../multi-driver-module/multi-driver-module.module';
import { AddTripV2DocumentsExpiryModule } from '../add-trip-v2/add-trip-v2-documents-expiry/add-trip-v2-documents-expiry.module';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { TripDetailsTimeSheetSectionComponent } from './trip-details-time-sheet-section/trip-details-time-sheet-section.component';
import { TripDetailsDeliveryNoteSectionComponent } from './trip-details-delivery-note-section/trip-details-delivery-note-section.component';
import { TripDetailsVoidJobComponent } from './trip-details-void-job/trip-details-void-job.component';
import { TripDetailsStartCompleteJobPopupComponent } from './trip-details-start-complete-job-popup/trip-details-start-complete-job-popup.component';
import { TripDetailsUploadTimeSheetPopupComponent } from './trip-details-upload-time-sheet-popup/trip-details-upload-time-sheet-popup.component';
import { TimeSheetApproveRejectPopupComponent } from './time-sheet-approve-reject-popup/time-sheet-approve-reject-popup.component';
import { TripDetailsMakeDeliveryNotePopupComponent } from './trip-details-make-delivery-note-popup/trip-details-make-delivery-note-popup.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LocationDetailsCraneComponent } from './location-details-crane/location-details-crane.component';
import { ViewUploadedDocumentModule } from '../../../../orgainzation-setting-module/organiation-profile-v2/view-uploaded-document/view-uploaded-document.module';
import { ApprovalTimelineModule } from '../../../approval-timeline-module/approval-timeline-module.module';
import { DateFormaterModule } from '../../../date-formater/date-formater.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TripDetailsStatusBlockComponent } from './trip-details-status-block/trip-details-status-block.component';
import { TripDetailsApproveRejectPopupComponent } from './trip-details-approve-reject-popup/trip-details-approve-reject-popup.component';
import {MatRadioModule} from '@angular/material/radio';
import { TripDetailsV2CommissionComponent } from './trip-details-v2-commission/trip-details-v2-commission.component';
import { TripContainerAddEditComponent } from './trip-container-add-edit/trip-container-add-edit.component';
import { ListViewSettingsModule } from '../list-module-v2/list-widget-list-view-settings/list-view-settings.module';
import { LocationV2Module } from '../location-v2/location-v2.module';
import { JobTokenVgmManagementComponent } from './job-token-vgm-management/job-token-vgm-management.component';
import { JobGatePassPdfComponent } from './job-gate-pass-pdf/job-gate-pass-pdf.component';
import { CancelTokenPupupComponent } from './cancel-token-pupup/cancel-token-pupup.component';



@NgModule({
  declarations: [
    NewTripDetailsV2Component,
    TripDetailsHeaderSectionComponent, 
    TripDetailsStatusSectionComponent,
    TripDetailsAddSectionComponent,
    TripDetailsSummarySectionComponent,
    TripDetailsProfitLossSectionComponent,
    TripDetailsTransactionSectionComponent,
    TripDetailsTripDocumentsSectionComponent,
    TripDetailsDriverLedgerSectionComponent,
    TripDetailsMapSectionComponent,
    EditTripHeaderComponent,
    AddFuelComponent,
    AddDriverAllowanceComponent,
    AddOtherExpensesComponent,
    ChargeDeductionComponent,
    ChangeDestinationStatusComponent,
    FinishTripComponent,
    AddEditMaterialComponent,    
    AddEditMaterialComponent,
    AddEditAddToInvoiceComponent,
    AddEditReduceFromInvoiceComponent,
    AddMaterialPopup,
    BdpStatusChangeComponent,
    VehicleChangeComponent,
    TripDetailsTimeSheetSectionComponent,
    TripDetailsDeliveryNoteSectionComponent,
    TripDetailsVoidJobComponent,
    TripDetailsStartCompleteJobPopupComponent,
    TripDetailsUploadTimeSheetPopupComponent,
    TimeSheetApproveRejectPopupComponent,
    TripDetailsMakeDeliveryNotePopupComponent,
    LocationDetailsCraneComponent,
    TripDetailsStatusBlockComponent,
    TripDetailsApproveRejectPopupComponent,
    TripDetailsV2CommissionComponent,
    TripContainerAddEditComponent,
    JobTokenVgmManagementComponent,
    JobGatePassPdfComponent,
    CancelTokenPupupComponent,
  ],
  imports: [
    CommonModule,
    GoThroughModule,
    AddTripV2DocumentsExpiryModule,
    AddItemModule,
    FormsModule,
    NgxPermissionsModule,
    ToolTipModule,
    EditBillingModuleV2Module,
    NewTripDetailsV2RoutingModule,
    TripDestinationDetailsModule,
    TripV2StatusModule,
    MatTabsModule,
    DialogModule,
    MatMenuModule,
    FileUploaderV2Module,
    ReactiveFormsModule,
    RouteEditModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    SharedModule,
    AddPartyPopupModule,
    NgxMatDatetimePickerModule,
    NgxMatMomentModule,
    FileDeleteViewModule,
    GoogleMapsModule,
    AddEditTripTaskModule,
    MultipleDestinationSharedModule,
    DeleteAlertModule,
    EditCustomFieldModule,
    LiveTrackingModule,
    RouterModule,
    MatTooltipModule,
    DateAndTimeModule,
    MatMomentDateModule,
    MultiDriverModule,
    AppErrorModuleModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatCheckboxModule,
    ViewUploadedDocumentModule,
    ApprovalTimelineModule,
    DateFormaterModule,
    ApprovalTimelineModule,
    MatButtonModule, MatIconModule,MatRadioModule,
    ListViewSettingsModule,
    MatRippleModule,
    LocationV2Module,
    MatNativeDateModule,

  ],
  providers:[{ provide: DateAdapter, useClass: AppDateAdapter }],
  exports:[ AddEditAddToInvoiceComponent, AddEditReduceFromInvoiceComponent,]
})
export class NewTripDetailsV2Module { }
