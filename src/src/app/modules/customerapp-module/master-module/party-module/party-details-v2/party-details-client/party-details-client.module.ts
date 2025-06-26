import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartyDetailsClientRoutingModule } from './party-details-client-routing.module';
import { PartyDetailsClientComponent } from './party-details-client/party-details-client.component';
import { PartyDetailsHeaderComponent } from './party-details-header/party-details-header.component';
import { PartyDetailsPartyInfoComponent } from './party-details-party-info/party-details-party-info.component';
import { PartyDetailsPartyTransactionsComponent } from './party-details-party-transactions/party-details-party-transactions.component';
import { PartyDetailsPartyTripSummaryComponent } from './party-details-party-trip-summary/party-details-party-trip-summary.component';
import { TableWidgetModule } from '../../../vehicle-module/own-venicle-module/vehicle-details-v2/table-widget-module/table-widget-module.module';
import { FileDeleteViewModule } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/new-trip-details-v2/file-delete-view-module/file-delete-view-module.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RateCardComponent } from './rate-card/rate-card.component';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { DateAdapter, MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ViewUploadedDocumentModule } from 'src/app/modules/orgainzation-setting-module/organiation-profile-v2/view-uploaded-document/view-uploaded-document.module';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { PartyCertificateRenewComponent } from '../party-certificate-renew/party-certificate-renew.component';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { PartyCertificateHistoryComponent } from './party-certificate-history/party-certificate-history.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ToolTipModule } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/tool-tip/tool-tip.module';
import { PartyStatementOfClientComponent } from './party-statement-of-client/party-statement-of-client.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import {MatMenuModule} from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';



@NgModule({
  declarations: [
    PartyDetailsClientComponent,
    PartyDetailsHeaderComponent,
    PartyDetailsPartyInfoComponent,
    PartyDetailsPartyTransactionsComponent,
    PartyDetailsPartyTripSummaryComponent,
    RateCardComponent,
    PartyCertificateRenewComponent,
    PartyCertificateHistoryComponent,
    PartyStatementOfClientComponent
  ],
  imports: [
    CommonModule,
    PartyDetailsClientRoutingModule,
    TableWidgetModule,
    AlertPopupModuleModule,
    FileDeleteViewModule,
    FormsModule,
    RouterModule,
    MatSlideToggleModule,
    MatRippleModule,
    ViewUploadedDocumentModule,
    SharedModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatMomentDateModule,
    NgxPermissionsModule.forChild(),
    ToolTipModule,
    PdfViewerModule,
    MatMenuModule,
    MatSelectModule,
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
})
export class PartyDetailsClientModule { }
