import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddEditLocalPurchaseOrderRoutingModule } from './add-edit-local-purchase-order-routing.module';
import { LocalPurchaseOrderComponent } from './local-purchase-order/local-purchase-order.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { AddPartyPopupModule } from '../../../master-module/party-module/add-party-popup-module/add-party-popup-module.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatMenuModule } from '@angular/material/menu';


@NgModule({
  declarations: [
    LocalPurchaseOrderComponent,
  ],
  imports: [
    CommonModule,
    AddEditLocalPurchaseOrderRoutingModule,
		ReactiveFormsModule,
		FormsModule,
		MatDatepickerModule,
		MatFormFieldModule,
		MatInputModule,
		MatNativeDateModule,
		AddPartyPopupModule,
		MatAutocompleteModule,
		SharedModule,	
    NgxPermissionsModule.forChild(),
	MatMenuModule,
	MatMomentDateModule
  ]
})
export class AddEditLocalPurchaseOrderModule { }
