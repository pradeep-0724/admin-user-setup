import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryModuleRoutingModule } from './inventory-module-adjustment-routing.module';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { AddTyreAdjustmentComponent } from './add-inventory-ajdustment/add-tyre-adjustment/add-tyre-adjustment.component';
import { AddSpareAdjustmentComponent } from './add-inventory-ajdustment/add-spare-adjustment/add-spare-adjustment.component';
import { AddInventoryAdjustmentComponent } from './add-inventory-ajdustment/add-inventory-adjustment.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatRadioModule } from '@angular/material/radio';
import { AddExpenseItemPopupModule } from '../../add-expense-item-popup-module/add-expense-item-popup-module.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';


@NgModule({
  declarations: [
      AddInventoryAdjustmentComponent,
      AddSpareAdjustmentComponent,
      AddTyreAdjustmentComponent,
    ],
  imports: [
    CommonModule,
    InventoryModuleRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatSortModule,
    MatTableModule,
    MatMomentDateModule,
    AddExpenseItemPopupModule,
    NgxPaginationModule,
    NgxPermissionsModule.forChild(),
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
})
export class InventoryAdjustmentModuleModule { }
