import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListViewPerformaInvoiceModuleRoutingModule } from './list-view-performa-invoice-module-routing.module';
import { PerformaInvoiceDetailsComponent } from './performa-invoice-details/performa-invoice-details.component';
import { PerformaInvoiceListComponent } from './performa-invoice-list/performa-invoice-list.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxPermissionsModule } from 'ngx-permissions';
import { CommentModule } from 'src/app/shared-module/components/comment/comment.module';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { AddEmailPopupModule } from '../../../add-email-popup-module/add-email-popup-module.module';
import { GoThroughModule } from '../../../go-through/go-through.module';
import { VideoPlayModule } from '../../../video-play-module/video-play-module.module';
import { ListModuleV2 } from '../../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';


@NgModule({
  declarations: [
    PerformaInvoiceDetailsComponent,
    PerformaInvoiceListComponent
  ],
  imports: [
    CommonModule,
    ListViewPerformaInvoiceModuleRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    SharedModule,
    MatSortModule,
    NgxPaginationModule,
    VideoPlayModule,
    MatIconModule,
    MatCheckboxModule,
    NgxPermissionsModule.forChild(),
    BsDatepickerModule.forRoot(),
    AddEmailPopupModule,
    GoThroughModule,
    PdfViewerModule,
    CommentModule,
    ListModuleV2
  ]
})
export class ListViewPerformaInvoiceModuleModule { }
