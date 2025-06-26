import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FleetOwnerExpenseRoutingModule } from './fleet-owner-expense-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { AddExpenseItemPopupModule } from 'src/app/modules/customerapp-module/add-expense-item-popup-module/add-expense-item-popup-module.module';
import { AddNewCoaModule } from 'src/app/modules/customerapp-module/master-module/chart-of-account-module/add-new-coa-module/add-new-coa-module.module';
import { AddPartyPopupModule } from 'src/app/modules/customerapp-module/master-module/party-module/add-party-popup-module/add-party-popup-module.module';
import { AddTripChallanPopupModule } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-module/add-trip-challan-popup-module/add-trip-challan-popup-module.module';
import { ChargesPopupModule } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-module/new-trip/charges-popup/charges-popup-module.module';
import { EditTripNewPopUpModule } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-module/new-trip/edit-trip-new-pop-up/edit-trip-new-pop-up-module.module';
import { TaxModuleModule } from 'src/app/tax-module/tax-module.module';
import { PaymentModule } from '../../operations-module/payment-module/payment-module.module';
import { EditOtherActivityModule } from '../../operations-module/other-activity-module/other-activity.module';
import { FleetOwnerExpensesComponent } from './fleet-owner-expenses.component';
import { AddFleetownerChallanComponent } from './add-fleetowner-challan/add-fleetowner-challan.component';
import { InvoiceService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/invoice-service/invoice.service';
import { FuelClassService } from '../../operations-module/fuel-expense/fuel-class/fuel.service';
import { FleetOwnerClassService } from './fleet-owner-class/fleet-owner.service';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { GoThroughModule } from '../../go-through/go-through.module';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatTabsModule } from '@angular/material/tabs';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { DateFormaterModule } from '../../date-formater/date-formater.module';


@NgModule({
  declarations: [FleetOwnerExpensesComponent,AddFleetownerChallanComponent],
  imports: [
    CommonModule,
	GoThroughModule,
    FleetOwnerExpenseRoutingModule,
    ReactiveFormsModule,
    SharedModule,
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
		BsDatepickerModule.forRoot(),
		TaxModuleModule,
		AddNewCoaModule,
		AddPartyPopupModule,
		EditOtherActivityModule,
		ChargesPopupModule,
    EditTripNewPopUpModule,
		AddExpenseItemPopupModule,
		AddTripChallanPopupModule,
		MatIconModule,
		MatMomentDateModule,
    PaymentModule,
	MatTabsModule,
	DateFormaterModule
  ],
  providers: [InvoiceService,FuelClassService,FleetOwnerClassService,   { provide: DateAdapter, useClass: AppDateAdapter }]

})
export class FleetOwnerExpenseModule { }
