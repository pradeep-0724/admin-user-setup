import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListEmployeeOthersRoutingModule } from './list-employee-others-routing.module';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { DetailsEmployeeOthersComponent } from './details-employee-others/details-employee-others.component';
import { ListEmployeeOthersComponent } from './list-employee-others.component';
import { EmployeeOthersPipe } from './employee-others-search.pipe';
import { NgxPermissionsModule } from 'ngx-permissions';
import { GoThroughModule } from '../../../go-through/go-through.module';
import { ListModuleV2 } from '../../new-trip-v2/list-module-v2/list-module-v2.module';


@NgModule({
  declarations: [DetailsEmployeeOthersComponent,ListEmployeeOthersComponent,EmployeeOthersPipe],
  imports: [
    CommonModule,
    ListModuleV2,
    ListEmployeeOthersRoutingModule,
    NgxPaginationModule,
		FormsModule,
		SharedModule,
		MatSortModule,
		MatIconModule,
    // ListWidgetModule,
    GoThroughModule,
		MatTableModule,
		PdfViewerModule,
    NgxPermissionsModule.forChild(),

  ]
})
export class ListEmployeeOthersModule { }
