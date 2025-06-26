import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IndividualInventoryModuleRoutingModule } from './individual-inventory-module-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ChartsModule } from 'ng2-charts';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { IndividualInventoryService } from '../../api-services/reports-module-services/individual-inventory-service/individual-inventory.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import { AddExpenseItemPopupModule } from '../../add-expense-item-popup-module/add-expense-item-popup-module.module';
import { CustomFilterPaginationModule } from '../../custom-filter-pagination-module/custom-filter-pagination-module.module';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';






@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IndividualInventoryModuleRoutingModule,
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
    ChartsModule,
    FormsModule,
    MatMomentDateModule,
    ReactiveFormsModule,
    SharedModule

  ],
  providers: [
    IndividualInventoryService, { provide: DateAdapter, useClass: AppDateAdapter }
  ],
})
export class IndividualInventoryModuleModule { }
