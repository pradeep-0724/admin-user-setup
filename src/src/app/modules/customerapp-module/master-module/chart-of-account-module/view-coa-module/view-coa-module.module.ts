import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewCoaModuleRoutingModule } from './view-coa-module-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxPermissionsModule } from 'ngx-permissions';
import { VideoPlayModule } from '../../../video-play-module/video-play-module.module';
import { AddNewCoaModule } from '../add-new-coa-module/add-new-coa-module.module';
import { EditChartOfAccountComponent } from '../coa-add-edit-module/edit-chart-of-account/edit-chart-of-account.component';
import { ListChartOfAccountComponent } from './view-chart-of-account-component/view-chart-of-account.component';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { MaterialDropDownModule } from '../../../material-drop-down-module/material-drop-down-module.module';
import { ListFilterModulePopupModule } from '../../../list-filter-module-popup-module/list-filter-module-popup-module.module';
import { ListModuleV2 } from '../../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';
import { DateAdapter } from '@angular/material/core';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { SharedModule } from 'src/app/shared-module/shared.module';


@NgModule({
  declarations: [
    ListChartOfAccountComponent,
    EditChartOfAccountComponent,],
  imports: [
    CommonModule,
    ViewCoaModuleRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    NgxPaginationModule,
    AlertPopupModuleModule,
    VideoPlayModule,
    AppErrorModuleModule,
    ListFilterModulePopupModule,
    AddNewCoaModule,
    MaterialDropDownModule,
    ListModuleV2,
    SharedModule,
    MatMomentDateModule,
    BsDatepickerModule.forRoot(),
    NgxPermissionsModule.forChild()
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
})
export class ViewCoaModule{ }
