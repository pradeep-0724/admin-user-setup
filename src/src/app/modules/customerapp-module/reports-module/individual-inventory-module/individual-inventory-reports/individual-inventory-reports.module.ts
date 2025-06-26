import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndividualInventoryReportsRoutingModule } from './individual-inventory-reports-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { AddExpenseItemPopupModule } from '../../../add-expense-item-popup-module/add-expense-item-popup-module.module';
import { CustomFilterPaginationModule } from '../../../custom-filter-pagination-module/custom-filter-pagination-module.module';
import { IndividualInventoryReportsComponent } from './individual-inventory-reports.component';
import { IssueLogListPipe } from './issuelog-search.pipe';
import { PurchaseLogListPipe } from './purchaselog-search.pipe';
import { SpareUsageLogListPipe } from './spare-usage-log.search.pipe';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';


@NgModule({
  declarations: [IndividualInventoryReportsComponent,PurchaseLogListPipe,IssueLogListPipe ,SpareUsageLogListPipe],
  imports: [
    CommonModule,
    IndividualInventoryReportsRoutingModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatTableModule,
    AddExpenseItemPopupModule,
    MatSortModule,
    MatSelectModule,
    CustomFilterPaginationModule,
    MatIconModule,
    NgxPaginationModule,
    BsDatepickerModule.forRoot(),
    FormsModule,
    MatMomentDateModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],

})
export class IndividualInventoryReportsModule { }
