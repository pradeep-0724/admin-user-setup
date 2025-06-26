import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuelExpenseRoutingModule } from './fuel-expense-routing.module';
import { AddVehicleFuelChallanComponent } from './add-vehicle-fuel-challan/add-vehicle-fuel-challan.component';
import { FuelExpenseComponent } from './fuel-expense.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxPermissionsModule } from 'ngx-permissions';
import { AddExpenseItemPopupModule } from 'src/app/modules/customerapp-module/add-expense-item-popup-module/add-expense-item-popup-module.module';
import { AddNewCoaModule } from 'src/app/modules/customerapp-module/master-module/chart-of-account-module/add-new-coa-module/add-new-coa-module.module';
import { AddPartyPopupModule } from 'src/app/modules/customerapp-module/master-module/party-module/add-party-popup-module/add-party-popup-module.module';
import { AddTripChallanPopupModule } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-module/add-trip-challan-popup-module/add-trip-challan-popup-module.module';
import { ChargesPopupModule } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-module/new-trip/charges-popup/charges-popup-module.module';
import { EditTripNewPopUpModule } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-module/new-trip/edit-trip-new-pop-up/edit-trip-new-pop-up-module.module';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { TaxModuleModule } from 'src/app/tax-module/tax-module.module';
import { PaymentModule } from '../payment-module/payment-module.module';
import { EditOtherActivityModule } from '../other-activity-module/other-activity.module';
import { InvoiceService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/invoice-service/invoice.service';
import { FleetOwnerClassService } from '../../sub-main-trip-module/fleet-owner-expenses/fleet-owner-class/fleet-owner.service';
import { FuelClassService } from './fuel-class/fuel.service';
import { GoThroughModule } from '../../go-through/go-through.module';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { DateFormaterModule } from '../../date-formater/date-formater.module';
import { DateDropDownModule } from '../../sub-main-trip-module/new-trip-v2/list-module-v2/date-drop-down-module/date-drop-down-module.module';


@NgModule({
  declarations: [FuelExpenseComponent,AddVehicleFuelChallanComponent],
  imports: [
    CommonModule,
    FuelExpenseRoutingModule,
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
	BsDatepickerModule.forRoot(),
	NgxPermissionsModule.forChild(),
	TaxModuleModule,
	AddNewCoaModule,
	AddPartyPopupModule,
	EditOtherActivityModule,
	ChargesPopupModule,
	EditTripNewPopUpModule,
	AddExpenseItemPopupModule,
	AddTripChallanPopupModule,
	MatIconModule,
    PaymentModule,
	MatMomentDateModule,
	GoThroughModule,
	DateFormaterModule,
	DateDropDownModule
  ],
  providers: [InvoiceService,FuelClassService,FleetOwnerClassService]
})
export class FuelExpenseModule { }
