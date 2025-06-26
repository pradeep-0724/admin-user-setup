import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListDetailsDebitNoteModuleRoutingModule } from './list-details-debit-note-module-routing.module';
import {  FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { AddEmailPopupModule } from '../../../add-email-popup-module/add-email-popup-module.module';
import { DebitListFilterPipe } from './debit-list-seach.pipe';
import { DebitDetailsComponent } from './debit-note-detail/debit-detail.component';
import { ListDebitNoteComponent } from './list-debit-note/list-debit-note.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { GoThroughModule } from '../../../go-through/go-through.module';
import { DateAdapter } from '@angular/material/core';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ListModuleV2 } from '../../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';


@NgModule({
  declarations: [
    ListDebitNoteComponent,
    DebitDetailsComponent,
    DebitListFilterPipe
  ],
  imports: [
    CommonModule,
    ListModuleV2,
    ListDetailsDebitNoteModuleRoutingModule,
    FormsModule,
    MatDatepickerModule,
    MatCheckboxModule,
    GoThroughModule,
    MatFormFieldModule,
    MatInputModule,
    SharedModule,
    MatSortModule,
    NgxPaginationModule,
    MatIconModule,
    PdfViewerModule,
    AddEmailPopupModule,
    MatMomentDateModule,
    NgxPermissionsModule.forChild(),
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
})
export class ListDetailsDebitNoteModule{ }
