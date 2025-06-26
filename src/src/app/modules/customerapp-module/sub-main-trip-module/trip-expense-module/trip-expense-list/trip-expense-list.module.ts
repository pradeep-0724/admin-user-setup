import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TripExpenseListRoutingModule } from './trip-expense-list-routing.module';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { DetailsTripExpenseComponent } from './details-trip-expense/details-trip-expense.component';
import { TripExpenseSearchPipe } from './trip-expense-search.pipe';
import { TripExpenseListComponent } from './trip-expense-list.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { GoThroughModule } from '../../../go-through/go-through.module';
import { ListModuleV2 } from '../../new-trip-v2/list-module-v2/list-module-v2.module';


@NgModule({
  declarations: [DetailsTripExpenseComponent,TripExpenseSearchPipe,TripExpenseListComponent],
  imports: [
    CommonModule,
    TripExpenseListRoutingModule,
    NgxPaginationModule,
		FormsModule,
		SharedModule,
		MatSortModule,
		MatIconModule,
    GoThroughModule,
		MatTableModule,
		PdfViewerModule,
    ListModuleV2,
    NgxPermissionsModule.forChild(),

  ]
})
export class TripExpenseListModule { }
