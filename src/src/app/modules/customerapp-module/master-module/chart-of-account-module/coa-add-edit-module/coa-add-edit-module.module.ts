import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoaAddEditModuleRoutingModule } from './coa-add-edit-module-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { VideoPlayModule } from '../../../video-play-module/video-play-module.module';
import { AddNewCoaModule } from '../add-new-coa-module/add-new-coa-module.module';
import { AddChartOfAccountComponent } from './add-chart-of-account-component/add-chart-of-account.component';
import { ChartOfAccountListFilterPipe } from './coa-search.pipe';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { DateAdapter } from '@angular/material/core';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';


@NgModule({
  declarations: [
    AddChartOfAccountComponent,
    ChartOfAccountListFilterPipe
  ],
  imports: [
    CommonModule,
    CoaAddEditModuleRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    NgxPaginationModule,
    AlertPopupModuleModule,
    AppErrorModuleModule,
    SharedModule,
    VideoPlayModule,
    AddNewCoaModule,
    MatMomentDateModule,
    BsDatepickerModule.forRoot(),
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
})
export class CoaAddEditModule { }
