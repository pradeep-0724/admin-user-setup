import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentRefundModuleRoutingModule } from './payment-refund-module-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { TaxModuleModule } from 'src/app/tax-module/tax-module.module';
import { AddPartyPopupModule } from '../../../master-module/party-module/add-party-popup-module/add-party-popup-module.module';
import { RefundPaymentComponent } from './refund-component/refund.component';
import { GoThroughModule } from '../../../go-through/go-through.module';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';


@NgModule({
  declarations: [ RefundPaymentComponent ],
  imports: [
    CommonModule,
    GoThroughModule,
    PaymentRefundModuleRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    SharedModule,
    AddPartyPopupModule,
    MatIconModule,
    MatMomentDateModule,
    TaxModuleModule
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
})
export class PaymentRefundModule{ }
