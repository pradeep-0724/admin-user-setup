import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListOtherActivityRoutingModule } from './list-other-activity-routing.module';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { OtherListActivityFilter } from './list-other-activity-search.pipe';
import { DetailsOthersExpenseComponent } from './details-others-expense/details-others-expense.component';
import { ListOtherActivityComponent } from './list-other-activity.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { GoThroughModule } from '../../../go-through/go-through.module';
import { ListModuleV2 } from '../../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';


@NgModule({
  declarations: [OtherListActivityFilter,DetailsOthersExpenseComponent,ListOtherActivityComponent],
  imports: [
    CommonModule,
    ListOtherActivityRoutingModule,
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
export class ListOtherActivityModule { }
