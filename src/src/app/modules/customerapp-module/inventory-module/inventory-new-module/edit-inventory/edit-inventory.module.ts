import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { EditInventoryRoutingModule } from './edit-inventory-routing.module';
import { EditNewSparesComponent } from './edit-new-spares/edit-new-spares.component';
import { EditNewTyreComponent } from './edit-new-tyre/edit-new-tyre.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';


import { EditInventoryComponent } from './edit-inventory.component';
import { TaxModuleModule } from 'src/app/tax-module/tax-module.module';
import { InvoiceService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/invoice-service/invoice.service';
import { OperationsActivityService } from '../../../api-services/operation-module-service/operations-activity.service';
import { AddPartyPopupModule } from 'src/app/modules/customerapp-module/master-module/party-module/add-party-popup-module/add-party-popup-module.module';
import { AddExpenseItemPopupModule } from 'src/app/modules/customerapp-module/add-expense-item-popup-module/add-expense-item-popup-module.module';
import { PaymentModule } from '../../../operations-module/payment-module/payment-module.module';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

@NgModule({
  declarations: [EditNewSparesComponent,
      EditNewTyreComponent,
      EditInventoryComponent],
  imports: [
    CommonModule,
    EditInventoryRoutingModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    FormsModule,
    AddPartyPopupModule,
    AddExpenseItemPopupModule,
    SharedModule,
    MatRadioModule,
    TaxModuleModule,
    MatMomentDateModule,
    PaymentModule
  ],
  providers:[OperationsActivityService,InvoiceService , { provide: DateAdapter, useClass: AppDateAdapter }]
})
export class EditInventoryModule { }
