import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListFleetOwnerExpenseRoutingModule } from './list-fleet-owner-expense-routing.module';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { DetailFleetownerV2Component } from './detail-fleetowner-v2/detail-fleetowner-v2.component';
import { ListFleetOwnerExpensesComponent } from './list-fleet-owner-expenses.component';
import { FleetOwnerExpenseSearchPipe } from './fleetowner-expense-search.pipe';
import { NgxPermissionsModule } from 'ngx-permissions';
import { GoThroughModule } from '../../../go-through/go-through.module';
import { ListModuleV2 } from '../../new-trip-v2/list-module-v2/list-module-v2.module';


@NgModule({
  declarations: [DetailFleetownerV2Component,ListFleetOwnerExpensesComponent,FleetOwnerExpenseSearchPipe],
  imports: [
    CommonModule,
    ListFleetOwnerExpenseRoutingModule,
    NgxPaginationModule,
		FormsModule,
		SharedModule,
		MatSortModule,
		MatIconModule,
		MatTableModule,
    ListModuleV2,
		PdfViewerModule,
    GoThroughModule,
    NgxPermissionsModule.forChild(),

  ]
})
export class ListFleetOwnerExpenseModule { }
