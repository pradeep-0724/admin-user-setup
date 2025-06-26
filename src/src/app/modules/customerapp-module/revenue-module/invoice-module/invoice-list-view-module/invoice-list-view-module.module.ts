import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceListViewModuleRoutingModule } from './invoice-list-view-module-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { AddEmailPopupModule } from '../../../add-email-popup-module/add-email-popup-module.module';
import { VideoPlayModule } from '../../../video-play-module/video-play-module.module';
import { InvoiceDetailsComponent } from './invoice-details/invoice-details.component';
import { ListInvoiceComponent } from './list-invoice/list-invoice.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CommentModule } from 'src/app/shared-module/components/comment/comment.module';
import { GoThroughModule } from '../../../go-through/go-through.module';
import { ListModuleV2 } from '../../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';
import { MatMenuModule } from '@angular/material/menu';



@NgModule({
  declarations: [ListInvoiceComponent,
    InvoiceDetailsComponent,],
  imports: [
    CommonModule,
    InvoiceListViewModuleRoutingModule,
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
    ListModuleV2,
    MatMenuModule,
    
  ]
})
export class InvoiceListViewModule { }
