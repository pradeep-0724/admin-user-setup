import { Component, Input, OnInit } from '@angular/core';
import { RateCardBillingBasedOn } from 'src/app/core/constants/constant';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { TaxService } from 'src/app/core/services/tax.service';

@Component({
  selector: 'app-new-quotation-v2-crane-charge-section',
  templateUrl: './new-quotation-v2-crane-charge-section.component.html',
  styleUrls: ['./new-quotation-v2-crane-charge-section.component.scss']
})
export class NewQuotationV2CraneChargeSectionComponent implements OnInit {

  selectedTab = 1;
  @Input() quotationDetail: any;
  vehObject: any;
  isTax = false;
  shift: 'Double Shift' | 'Single Shift' = 'Single Shift'
  quotationBasedOn: 'hour' | 'day' = 'day' 
  rateCardBilling = new RateCardBillingBasedOn();
  rateCardBillingList = this.rateCardBilling.RateCardbillingUnitsList
  rateCardBillingHour = this.rateCardBilling.hour
  rateCardBillingDays = this.rateCardBilling.day
  billingUnitlabel=''
  currency_type

  constructor(private _tax: TaxService,private _currency: CurrencyService,) { }

  ngOnInit(): void {
    this.isTax = this._tax.getTax();
    this.currency_type = this._currency.getCurrency();
    this.vehObject = this.quotationDetail[this.quotationDetail.vehicle_category.toLowerCase()]
    this.getShiftsNo()

  }

  tabChanged(tab) {
    this.selectedTab = tab;
  }

  findCategory(type) {
    if (type == 'truck') {
      return 'truck'
    } else if (type == 'crane') {
      return 'crane'
    } else if (type == 'awp') {
      return 'awp'
    }
  }
  getShiftsNo() {
    this.shift = this.quotationDetail[this.findCategory((this.quotationDetail?.vehicle_category).toLowerCase())]?.rental_charge?.no_of_shifts
    this.quotationBasedOn= this.quotationDetail[this.findCategory((this.quotationDetail?.vehicle_category).toLowerCase())]?.rental_charge?.billing_unit
    this.billingUnitlabel= this.rateCardBillingList.find(type=>type.value==this.quotationBasedOn).label
    if(this.quotationBasedOn=='hour'){
      if (this.shift == 'Double Shift') {
        this.rateCardBillingHour.day *= 2;
        this.rateCardBillingHour.week *= 2
        this.rateCardBillingHour.month *= 2
      }
    }
   
  }

  getColSpan(a, b) {
    if (a && b) {
      return 3
    } else if (a || b) {
      return 2

    } else {
      return 0
    }
  }


}
