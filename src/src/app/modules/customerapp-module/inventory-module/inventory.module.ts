import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxPermissionsModule } from 'ngx-permissions';
import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryService } from '../api-services/inventory-service/inventory.service';
import { OperationsActivityService } from '../api-services/operation-module-service/operations-activity.service';
import { InventoryComponent } from './inventory.component';
import { EditInventoryAdjustmentComponent } from './inventory-adjustment-module/edit-inventory-adjustment/edit-inventory-adjustment.component';
import { EditSpareAdjustmentComponent } from './inventory-adjustment-module/edit-inventory-adjustment/edit-spare-adjustment/edit-spare-adjustment.component';
import { EditTyreAdjustmentComponent } from './inventory-adjustment-module/edit-inventory-adjustment/edit-tyre-adjustment/edit-tyre-adjustment.component';
import { TaxModuleModule } from 'src/app/tax-module/tax-module.module';
import { InvoiceService } from '../api-services/revenue-module-service/invoice-service/invoice.service';
import { AddPartyPopupModule } from '../master-module/party-module/add-party-popup-module/add-party-popup-module.module';
import { AddExpenseItemPopupModule } from '../add-expense-item-popup-module/add-expense-item-popup-module.module';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

@NgModule({
  declarations: [
    InventoryComponent,
    EditInventoryAdjustmentComponent,
    EditSpareAdjustmentComponent,
    EditTyreAdjustmentComponent
  ],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatTableModule,
    MatSortModule,
    MatSortModule,
    MatIconModule,
    MatRadioModule,
    NgxPaginationModule,
    MatDialogModule,
    MatButtonModule,
    AddPartyPopupModule,
    AddExpenseItemPopupModule,
    MatMomentDateModule,
    MatCheckboxModule,
    NgxPermissionsModule.forChild(),
    TaxModuleModule,


  ],
  exports:[
    InventoryRoutingModule,
  ],
  providers: [InventoryService, OperationsActivityService,InvoiceService,{ provide: DateAdapter, useClass: AppDateAdapter }]

})
export class InventoryModuleModule { }
