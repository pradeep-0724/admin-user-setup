import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryRoutingModule } from './inventory-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ChartsModule } from 'ng2-charts';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { InventoryComponent } from './inventory.component';
import { OverallInventoryPipe } from './overall-inventory-search.pipe';


@NgModule({
  declarations: [InventoryComponent,OverallInventoryPipe],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    BsDatepickerModule.forRoot(),
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    ChartsModule,
    MatSortModule,
    MatTableModule,
  ]
})
export class InventoryModule { }
