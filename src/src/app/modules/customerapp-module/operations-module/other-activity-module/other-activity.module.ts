import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditOtherActivityRoutingModule } from './other-activity-routing.module';
import { OtherActivityComponent } from './other-activity.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { TaxModuleModule } from 'src/app/tax-module/tax-module.module';
import { OtherClassService } from './other-class/other.service';
import { AddPartyPopupModule } from 'src/app/modules/customerapp-module/master-module/party-module/add-party-popup-module/add-party-popup-module.module';
import { AddNewCoaModule } from 'src/app/modules/customerapp-module/master-module/chart-of-account-module/add-new-coa-module/add-new-coa-module.module';
import { AddExpenseItemPopupModule } from 'src/app/modules/customerapp-module/add-expense-item-popup-module/add-expense-item-popup-module.module';
import { PaymentModule } from '../payment-module/payment-module.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { GoThroughModule } from '../../go-through/go-through.module';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

@NgModule({
	declarations: [
		OtherActivityComponent
	],
	imports: [
		CommonModule,
		GoThroughModule,
		EditOtherActivityRoutingModule,
		ReactiveFormsModule,
		FormsModule,
		MatDatepickerModule,
		MatFormFieldModule,
		MatInputModule,
		MatNativeDateModule,
		AddPartyPopupModule,
		MatAutocompleteModule,
		SharedModule,
		AddNewCoaModule,
		AddExpenseItemPopupModule,
    NgxPermissionsModule.forChild(),
    TaxModuleModule,
    PaymentModule,
	MatMomentDateModule
	],
  providers :[OtherClassService]
})
export class EditOtherActivityModule {}
