import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListInventoryNewRoutingModule } from './list-inventory-new-routing.module';
import { ListInventoryNewComponent } from './list-inventory-new.component';
import { DetailsInventoryComponent } from '../details-inventory/details-inventory.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ListWidgetModule } from 'src/app/shared-module/list-widget-module/list-widget-module.module';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { InventoryListActivityFilter } from '../../list-inventory-module/list-inventory-activity-search.pipe';


@NgModule({
  declarations: [ListInventoryNewComponent,DetailsInventoryComponent,InventoryListActivityFilter],
  imports: [
    CommonModule,
    ListInventoryNewRoutingModule,
    NgxPaginationModule,
		FormsModule,
		SharedModule,
		MatSortModule,
		MatTableModule,
    ListWidgetModule,
		NgxPermissionsModule.forChild()
  ]
})
export class ListInventoryNewModule { }
