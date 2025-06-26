import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouteSummaryModuleRoutingModule } from './route-summary-module-routing.module';
import { RouteSummaryComponent } from './route-summary.component';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxPermissionsModule } from 'ngx-permissions';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { RouteSummaryService } from '../../api-services/reports-module-services/route-summary-service/route-summary.service';
import { RouteSummarySearch } from './route-summary-search.pipe';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';


@NgModule({
  declarations: [RouteSummaryComponent,RouteSummarySearch],
  imports: [
    CommonModule,
    RouteSummaryModuleRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    NgxPaginationModule,
    MatTableModule,
    MatSortModule,
    MatMomentDateModule,
    BsDatepickerModule.forRoot(),
    NgxPermissionsModule.forChild()
  ],
  providers:[RouteSummaryService, { provide: DateAdapter, useClass: AppDateAdapter }]
})
export class RouteSummaryModule { }
