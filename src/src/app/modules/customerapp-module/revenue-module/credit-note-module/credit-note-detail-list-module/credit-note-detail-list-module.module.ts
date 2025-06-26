import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditNoteDetailListModuleRoutingModule } from './credit-note-detail-list-module-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { AddEmailPopupModule } from '../../../add-email-popup-module/add-email-popup-module.module';
import { VideoPlayModule } from '../../../video-play-module/video-play-module.module';
import { CreditListFilterPipe } from './credit-list-search.pipe';
import { CreditDetailsComponent } from './credit-detail/credit-detail.component';
import { ListCreditNoteComponent } from './list-credit-note/list-credit-note.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { GoThroughModule } from '../../../go-through/go-through.module';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ListModuleV2 } from '../../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';


@NgModule({
  declarations: [
    ListCreditNoteComponent,
    CreditDetailsComponent,
    CreditListFilterPipe
  ],
  imports: [
    CommonModule,
    ListModuleV2,
    CreditNoteDetailListModuleRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    SharedModule,
    MatIconModule,
    MatSortModule,
    NgxPaginationModule,
    MatCheckboxModule,
    NgxPermissionsModule.forChild(),
    MatIconModule,
    PdfViewerModule,
    VideoPlayModule,
    GoThroughModule,
    MatMomentDateModule,
    AddEmailPopupModule,
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
})
export class CreditNoteDetailListModule{ }
