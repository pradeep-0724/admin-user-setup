import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentsChequeModuleRoutingModule } from './payments-cheque-module-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { ChequePayementSearchPipePipe } from './cheque-payment/cheque-payement-search-pipe.pipe';
import { ChequePaymentComponent } from './cheque-payment/cheque-payment.component';
import { UpdateChequeStatusComponent } from './update-cheque-status/update-cheque-status.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxPermissionsModule } from 'ngx-permissions';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ListModuleV2 } from '../../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';


@NgModule({
  declarations: [ChequePaymentComponent, ChequePayementSearchPipePipe,UpdateChequeStatusComponent],
  imports: [
    CommonModule,
    PaymentsChequeModuleRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    SharedModule,
    NgxPaginationModule,
    MatIconModule,
    MatMomentDateModule,
    ListModuleV2,
    NgxPermissionsModule.forChild(),

  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
})
export class PaymentsChequeModule { }
