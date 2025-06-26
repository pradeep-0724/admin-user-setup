import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyTaxBoxComponent } from './company-tax-box/company-tax-box.component';
import { IndianTaxCompanyFieldsComponent } from './company-tax-box/indian-tax-company-fields/indian-tax-company-fields.component';
import { SharedModule } from '../shared-module/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { PartyTaxBoxComponent } from './party-tax-box/party-tax-box.component';
import { PartyTaxComponent } from './party-tax-box/party-tax/party-tax.component';
import { HeaderInputFieldBoxComponent } from './header-input-field-box/header-input-field-box.component';
import { IndianTaxHeaderFieldComponent } from './header-input-field-box/indian-tax-header-field/indian-tax-header-field.component';
import { LastSectionInputfieldBoxComponent } from './last-section-inputfield-box/last-section-inputfield-box.component';
import { TdsSectionInputfieldComponent } from './last-section-inputfield-box/tds-section-inputfield/tds-section-inputfield.component';
import { RevenueHeaderTaxBoxComponent } from './revenue-header-tax-box/revenue-header-tax-box.component';
import { RevenueIndianTaxComponent } from './revenue-header-tax-box/revenue-indian-tax/revenue-indian-tax.component';
import { RevenuePaymentBoxComponent } from './revenue-payment-box/revenue-payment-box.component';
import { RevenuePaymentComponent } from './revenue-payment-box/revenue-payment/revenue-payment.component';
import { AdvancePaymentBoxComponent } from './advance-payment-box/advance-payment-box.component';
import { AdvancePaymentComponent } from './advance-payment-box/advance-payment/advance-payment.component';
import { AppDateAdapter } from '../core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { TaxInclusiveComponent } from './tax-inclusive/tax-inclusive.component';
@NgModule({
  declarations: [CompanyTaxBoxComponent, IndianTaxCompanyFieldsComponent, PartyTaxBoxComponent, PartyTaxComponent, HeaderInputFieldBoxComponent, IndianTaxHeaderFieldComponent, LastSectionInputfieldBoxComponent, TdsSectionInputfieldComponent, RevenueHeaderTaxBoxComponent, RevenueIndianTaxComponent, RevenuePaymentBoxComponent, RevenuePaymentComponent, AdvancePaymentBoxComponent, AdvancePaymentComponent, TaxInclusiveComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule ,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatMomentDateModule,
    MatRadioModule,
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
  exports:[CompanyTaxBoxComponent,PartyTaxBoxComponent,RevenuePaymentBoxComponent,AdvancePaymentBoxComponent,
    HeaderInputFieldBoxComponent,LastSectionInputfieldBoxComponent,RevenueHeaderTaxBoxComponent,TaxInclusiveComponent]
})
export class TaxModuleModule { }
