import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverallRoutingModule } from './overall.routing';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ChartsModule } from 'ng2-charts';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverallModuleService } from '../../api-services/reports-module-services/over-all-service/overall.service';
@NgModule({
  imports: [
    CommonModule,
    OverallRoutingModule,
    BsDatepickerModule.forRoot(),
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    ChartsModule,
    MatSortModule,
    MatTableModule,
  ],
  exports: [
    OverallRoutingModule,
    MatTableModule,
  ],

  providers: [
    OverallModuleService
  ],
})
export class OverallModuleModule { }
