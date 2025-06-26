import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripExpenseModuleRoutingModule } from './trip-expense-module-routing.module';
import { TripExpenseComponent } from './trip-expense/trip-expense.component';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { NgxPaginationModule } from 'ngx-pagination';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { TaxModuleModule } from 'src/app/tax-module/tax-module.module';
import { TripExpenseChallanComponent } from './trip-expense-challan/trip-expense-challan.component';
import { TripExpenseService } from '../../api-services/trip-module-services/trip-expense-service/trip-expense-service.service';
import { AddPartyPopupModule } from 'src/app/modules/customerapp-module/master-module/party-module/add-party-popup-module/add-party-popup-module.module';
import { AddNewCoaModule } from 'src/app/modules/customerapp-module/master-module/chart-of-account-module/add-new-coa-module/add-new-coa-module.module';
import { AddExpenseItemPopupModule } from 'src/app/modules/customerapp-module/add-expense-item-popup-module/add-expense-item-popup-module.module';
import { PaymentModule } from '../../operations-module/payment-module/payment-module.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { GoThroughModule } from '../../go-through/go-through.module';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { DateFormaterModule } from '../../date-formater/date-formater.module';

@NgModule({
  declarations: [TripExpenseComponent, TripExpenseChallanComponent],
  imports: [
    CommonModule,
	GoThroughModule,
    TripExpenseModuleRoutingModule,
    SharedModule,
		ReactiveFormsModule,
		FormsModule,
		MatDatepickerModule,
		MatFormFieldModule,
		MatRadioModule,
		MatInputModule,
		MatNativeDateModule,
		MatAutocompleteModule,
		NgxPaginationModule,
		MatTableModule,
		MatSortModule,
		BsDatepickerModule,
		AddPartyPopupModule,
		TaxModuleModule,
		MatIconModule,
		AddNewCoaModule,
		MatMomentDateModule,
		AddExpenseItemPopupModule,
		DateFormaterModule,
    NgxPermissionsModule.forChild(),
    PaymentModule
  ],
  providers:[TripExpenseService]
})
export class TripExpenseModuleModule { }
