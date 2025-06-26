import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewPettyExpenseComponent } from './view-petty-expense/view-petty-expense.component';
import { PettyExpenseRoutingModule } from './petty-expense-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { PettyExpenseService } from './petty-expense.service';
import { DetailsPettyExpenseComponent } from './details-petty-expense/details-petty-expense.component';
import { InvoiceService } from '../../api-services/revenue-module-service/invoice-service/invoice.service';
import { NgxPermissionsModule } from 'ngx-permissions';
import { PettyExpenseComponent } from './petty-expense/petty-expense.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { PettyExpenseListFilterPipe } from './petty-expense-search.pipe';
import { OperationsActivityService } from '../../api-services/operation-module-service/operations-activity.service';
import { AddNewCoaModule } from '../../master-module/chart-of-account-module/add-new-coa-module/add-new-coa-module.module';
import { AddExpenseItemPopupModule } from '../../add-expense-item-popup-module/add-expense-item-popup-module.module';
import { GoThroughModule } from '../../go-through/go-through.module';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ListModuleV2 } from '../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';


@NgModule({
  declarations: [ ViewPettyExpenseComponent, PettyExpenseComponent, DetailsPettyExpenseComponent,PettyExpenseListFilterPipe],
  imports: [
    CommonModule,
    GoThroughModule,
    PettyExpenseRoutingModule,
    FormsModule,
    SharedModule,
    ListModuleV2,
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
    NgxPaginationModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    AddNewCoaModule,
    AddExpenseItemPopupModule,
    MatMomentDateModule,
    NgxPermissionsModule.forChild()

  ],
  exports:[
    PettyExpenseRoutingModule
  ],
  providers: [PettyExpenseService,InvoiceService,OperationsActivityService,{ provide: DateAdapter, useClass: AppDateAdapter }],


})
export class PettyExpenseModuleModule { }
