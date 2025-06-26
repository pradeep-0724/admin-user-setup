import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListFuelRoutingModule } from './list-fuel-routing.module';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxPaginationModule } from 'ngx-pagination';
// import { ListWidgetModule } from 'src/app/shared-module/list-widget-module/list-widget-module.module';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { DetailsFuelExpenseComponent } from './details-fuel-expense/details-fuel-expense.component';
import { ListFuelComponent } from './list-fuel.component';
import { FuelExpensePipe } from './fuel-expense.pipe';
import { NgxPermissionsModule } from 'ngx-permissions';
import { GoThroughModule } from '../../../go-through/go-through.module';
import { ListModuleV2 } from '../../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';


@NgModule({
  declarations: [DetailsFuelExpenseComponent,ListFuelComponent,FuelExpensePipe],
  imports: [
    CommonModule,
    ListFuelRoutingModule,
    NgxPaginationModule,
		FormsModule,
		SharedModule,
		MatSortModule,
		MatIconModule,
    // ListWidgetModule,
		MatTableModule,
		PdfViewerModule,
    NgxPermissionsModule.forChild(),
    GoThroughModule,
     ListModuleV2

  ]
})
export class ListFuelModule { }
