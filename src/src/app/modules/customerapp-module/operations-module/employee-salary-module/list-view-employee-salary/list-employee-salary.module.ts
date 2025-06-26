import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListEmployeeSalaryRoutingModule } from './list-employee-salary-routing.module';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { DetailsEmployeeSalaryComponent } from './details-employee-salary/details-employee-salary.component';
import { ListViewEmployeeSalaryComponent } from './list-view-employee-salary.component';
import { EmployeeSalaryListSearchPipe } from './employee-salary-list-search.pipe';
import { NgxPermissionsModule } from 'ngx-permissions';
import { GoThroughModule } from '../../../go-through/go-through.module';
import { ListModuleV2 } from '../../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';


@NgModule({
  declarations: [DetailsEmployeeSalaryComponent,ListViewEmployeeSalaryComponent,EmployeeSalaryListSearchPipe],
  imports: [
    CommonModule,
    ListEmployeeSalaryRoutingModule,
    NgxPaginationModule,
		FormsModule,
		SharedModule,
		MatSortModule,
		MatIconModule,
    ListModuleV2,
		MatTableModule,
		PdfViewerModule,
    NgxPermissionsModule.forChild(),
    GoThroughModule

  ]
})
export class ListEmployeeSalaryModule { }
