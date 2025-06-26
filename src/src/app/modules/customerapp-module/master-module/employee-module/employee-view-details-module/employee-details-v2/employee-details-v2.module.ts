import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeDetailsV2RoutingModule } from './employee-details-v2-routing.module';
import { EmployeeHeaderV2Component } from './employee-header-v2/employee-header-v2.component';
import { EmployeeOverViewV2Component } from './employee-over-view-v2/employee-over-view-v2.component';
import { EmployeeDetailsV2Component } from './employee-details-v2/employee-details-v2.component';
import { EmployeeInfoV2Component } from './employee-info-v2/employee-info-v2.component';
import { EmployeeTransactionsV2Component } from './employee-transactions-v2/employee-transactions-v2.component';
import { EmployeeTimelogV2Component } from './employee-timelog-v2/employee-timelog-v2.component';
import { TableWidgetModule } from '../../../vehicle-module/own-venicle-module/vehicle-details-v2/table-widget-module/table-widget-module.module';
import { EmployeeTripInfoComponent } from './employee-trip-info/employee-trip-info.component';
import { EmployeeSharedModuleModule } from '../../employee-shared-module/employee-shared-module.module';
import { DateAdapter, MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { ViewUploadedDocumentModule } from 'src/app/modules/orgainzation-setting-module/organiation-profile-v2/view-uploaded-document/view-uploaded-document.module';
import { EditEmployeeMoneyInOutPopupComponent } from './edit-employee-money-in-out-popup/edit-employee-money-in-out-popup.component';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialDropDownModule } from 'src/app/modules/customerapp-module/material-drop-down-module/material-drop-down-module.module';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { DialogModule } from '@angular/cdk/dialog';
import { EmployeeCertificateHistoryModule } from './employee-details-v2/employee-certificate-history/employee-certificate-history.module';


@NgModule({
  declarations: [
    EmployeeHeaderV2Component,
    EmployeeOverViewV2Component,
    EmployeeDetailsV2Component,
    EmployeeInfoV2Component,
    EmployeeTransactionsV2Component,
    EmployeeTimelogV2Component,
    EmployeeTripInfoComponent,
    EditEmployeeMoneyInOutPopupComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EmployeeDetailsV2RoutingModule,
    TableWidgetModule,
    EmployeeSharedModuleModule,
    MatRippleModule,
    ViewUploadedDocumentModule,
    AppErrorModuleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    SharedModule,
    MatMomentDateModule,
    MaterialDropDownModule,
    DialogModule,
    SharedModule,
    EmployeeCertificateHistoryModule
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],

})
export class EmployeeDetailsV2Module { }
