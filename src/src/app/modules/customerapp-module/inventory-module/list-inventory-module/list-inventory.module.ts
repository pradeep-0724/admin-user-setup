import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared-module/shared.module'
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ListInventoryRoutingModule } from './list-inventory-routing.module';
import { ListInventoryComponent } from './list-inventory.component';
import { InventoryAdjustmentDetailsComponent } from '../inventory-adjustment-module/detail-inventory-adjustment/detail-inventory-adjustment.component';
import { ListSparesAdjustmentComponent } from './list-inventory-adjustment/list-spares-adjustment/list-spares-adjustment.component';
import { ListTyresAdjustmentComponent } from './list-inventory-adjustment/list-tyres-adjustment/list-tyres-adjustment.component';
import { InventoryAdjustmentSpareSearchPipe } from './inventory-adjustment-spare-search.pipe';
import { InventoryAdjustmentTyreSearchPipe } from './inventory-adjustment-tyre-search.pipe';
import { ListWidgetModule } from 'src/app/shared-module/list-widget-module/list-widget-module.module';


@NgModule({
	declarations: [
		ListInventoryComponent,
		ListSparesAdjustmentComponent,
		ListTyresAdjustmentComponent,
    InventoryAdjustmentDetailsComponent,
    InventoryAdjustmentSpareSearchPipe,
    InventoryAdjustmentTyreSearchPipe,

	],
	imports: [
		CommonModule,
		NgxPaginationModule,
		FormsModule,
		ListInventoryRoutingModule,
		SharedModule,
		MatSortModule,
		MatTableModule,
    ListWidgetModule,
		NgxPermissionsModule.forChild()
	]
})
export class ListInventoryModule {}
