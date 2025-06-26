import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BosListViewModuleRoutingModule } from './bos-list-view-module-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { AddEmailPopupModule } from '../../../add-email-popup-module/add-email-popup-module.module';
import { VideoPlayModule } from '../../../video-play-module/video-play-module.module';
import { BillofsupplyDetailsComponent } from './billofsupply-details/billofsupply-details.component';
import { ListBillOfSupplyComponent } from './list-bill-of-supply/list-bill-of-supply.component';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ListModuleV2 } from '../../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';


@NgModule({
  declarations: [ ListBillOfSupplyComponent, BillofsupplyDetailsComponent],
  imports: [
    CommonModule,
    BosListViewModuleRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    SharedModule,
    MatTableModule,
    MatSortModule,
    ListModuleV2,
    MatIconModule,
    NgxPaginationModule,
    MatCheckboxModule,
    MatIconModule,
    NgxPermissionsModule.forChild(),
    BsDatepickerModule.forRoot(),
    VideoPlayModule,
    MatMomentDateModule,
    AddEmailPopupModule,
    PdfViewerModule
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
})
export class BosListViewModule{ }
