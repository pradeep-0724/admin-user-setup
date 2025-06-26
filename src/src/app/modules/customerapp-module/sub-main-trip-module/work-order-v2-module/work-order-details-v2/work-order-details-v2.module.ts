import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkOrderHeaderDetailsV2Component } from './work-order-header-details-v2/work-order-header-details-v2.component';
import { WorkOrderDetailsV2RoutingModule } from './work-order-details-v2-routing.module';
import { WorkOrderDetailsV2Component } from './work-order-details-v2/work-order-details-v2.component';
import { WorkOrderTripInfoComponent } from './work-order-trip-info/work-order-trip-info.component';
import { WorkOrderRouteInfoComponent } from './work-order-route-info/work-order-route-info.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ExpectedTenureWorkOrderDatesComponent } from './expected-tenure-work-order-dates/expected-tenure-work-order-dates.component';
import { TripV2StatusModule } from '../../new-trip-v2/trip-v2-status/trip-v2-status.module';
import { EditTenurePopupComponent } from './edit-tenure-popup/edit-tenure-popup.component';
import { DialogModule } from '@angular/cdk/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { EditCustomFieldModule } from '../../new-trip-v2/new-trip-details-v2/edit-custom-fields/edit-custom-field.module';
import { ListModuleV2 } from '../../new-trip-v2/list-module-v2/list-module-v2.module';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { MaterialDropDownModule } from '../../../material-drop-down-module/material-drop-down-module.module';
import { EditWorkOrderBillingsComponent } from './edit-work-order-billings/edit-work-order-billings.component';
import { ToolTipModule } from '../../new-trip-v2/tool-tip/tool-tip.module';
import { WorkOrderTenureStatusModule } from '../work-order-shared-module/work-order-tenure-status/work-order-tenure-status.module';
import { OrderStatusFormatDataPipe } from './order-status.pipe';
import { CreateMultiTripModule } from '../work-order-shared-module/create-multi-trip/create-multi-trip-module.module';
import { DateAdapter, MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { WorkOrderCraneDetailsV2Component } from './new-work-order-v2/work-order-crane-details-v2/work-order-crane-details-v2.component';
import { WorkOrderCraneHeaderDetailsV2Component } from './new-work-order-v2/work-order-crane-header-details-v2/work-order-crane-header-details-v2.component';
import { WorkOrderChargesCraneDetailsV2Component } from './new-work-order-v2/work-order-charges-crane-details-v2/work-order-charges-crane-details-v2.component';
import { WorkOrderBalanceCraneDetailsV2Component } from './new-work-order-v2/work-order-balance-crane-details-v2/work-order-balance-crane-details-v2.component';
import { TableWidgetModule } from '../../../master-module/vehicle-module/own-venicle-module/vehicle-details-v2/table-widget-module/table-widget-module.module';
import { WorkOrderStatusBlockComponent } from './work-order-status-block/work-order-status-block.component';
import { WorkOrderApprovalRejectPopupComponent } from './work-order-approval-reject-popup/work-order-approval-reject-popup.component';
import { WorkOrderVoidQuotationComponent } from './work-order-void-quotation/work-order-void-quotation.component';
import { WorkOrderViewTimelineComponent } from './work-order-view-timeline/work-order-view-timeline.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { DateFormaterModule } from '../../../date-formater/date-formater.module';
import { AddTripV2DocumentsExpiryModule } from '../../new-trip-v2/add-trip-v2/add-trip-v2-documents-expiry/add-trip-v2-documents-expiry.module';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { DeleteAlertModule } from 'src/app/shared-module/delete-alert-module/delete-alert-module.module';
import { WorkOrderCargoJobInfoComponent } from './work-order-cargo-job-info/work-order-cargo-job-info.component';
import { WorkOrderCargoMaterialTabComponent } from './work-order-cargo-material-tab/work-order-cargo-material-tab.component';
import { WorkOrderViewContainerAddEditComponent } from './work-order-view-container-add-edit/work-order-view-container-add-edit.component';
import { ListViewSettingsModule } from '../../new-trip-v2/list-module-v2/list-widget-list-view-settings/list-view-settings.module';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { LocationV2Module } from '../../new-trip-v2/location-v2/location-v2.module';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { DateAndTimeModule } from '../../../date-and-time-module/date-and-time-module.module';
import {  CdkScrollableModule } from '@angular/cdk/scrolling';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WorkorderToJobContainerComponent } from './workorder-to-job-container/workorder-to-job-container.component';
import { MultiDriverModule } from '../../new-trip-v2/multi-driver-module/multi-driver-module.module';
import { ContainerSearchPipe } from './container-list-search.pipe';
import { ContainerPathPopUpComponent } from './container-path-pop-up/container-path-pop-up.component';
import { AddPartyPopupModule } from '../../../master-module/party-module/add-party-popup-module/add-party-popup-module.module';
import { WorkorderContainerInfoComponent } from './workorder-container-info/workorder-container-info.component';
import { FileUploaderV2Module } from '../../new-trip-v2/file-uploader-v2-module/file-uploader-module.module';
import { FileDeleteViewModule } from '../../new-trip-v2/new-trip-details-v2/file-delete-view-module/file-delete-view-module.module';
import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({
  declarations: [
    WorkOrderHeaderDetailsV2Component,
    WorkOrderDetailsV2Component,
    WorkOrderTripInfoComponent,
    WorkOrderRouteInfoComponent,
    ExpectedTenureWorkOrderDatesComponent,
    EditTenurePopupComponent,
    EditWorkOrderBillingsComponent,  
    ContainerSearchPipe,
    OrderStatusFormatDataPipe, WorkOrderCraneDetailsV2Component, WorkOrderCraneHeaderDetailsV2Component, WorkOrderChargesCraneDetailsV2Component, WorkOrderBalanceCraneDetailsV2Component, WorkOrderStatusBlockComponent, WorkOrderApprovalRejectPopupComponent, WorkOrderVoidQuotationComponent, WorkOrderViewTimelineComponent, WorkOrderCargoJobInfoComponent, WorkOrderCargoMaterialTabComponent, WorkOrderViewContainerAddEditComponent, WorkorderToJobContainerComponent, ContainerPathPopUpComponent, WorkorderContainerInfoComponent  
  ],
  imports: [
    CdkScrollableModule,
    MaterialDropDownModule,
    AppErrorModuleModule,
    CommonModule,
    MatTabsModule,
    TripV2StatusModule,
    DialogModule,
    MatCheckboxModule,
    FileUploaderV2Module,
    FileDeleteViewModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    ChartsModule,
    LocationV2Module,
    AddPartyPopupModule,
    EditCustomFieldModule,
    ListModuleV2,
    WorkOrderDetailsV2RoutingModule,
    ToolTipModule,
    MatMomentDateModule,
    WorkOrderTenureStatusModule,
    CreateMultiTripModule,
    TableWidgetModule,
    AddTripV2DocumentsExpiryModule,
    NgxPermissionsModule.forChild(),
    DateFormaterModule,
    DeleteAlertModule,
    AlertPopupModuleModule,
    ListViewSettingsModule,
    MatIconModule,
    MatRippleModule,
    MatMenuModule,
    LocationV2Module,
    SharedModule,
    DateAndTimeModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CdkScrollableModule,
    MultiDriverModule,
    MatTooltipModule,

  ],
  providers:[{ provide: DateAdapter, useClass: AppDateAdapter }],
})
export class WorkOrderDetailsV2Module { }
