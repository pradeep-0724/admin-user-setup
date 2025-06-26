import { Component, Input, OnInit } from '@angular/core';
import { RateCardBillingBasedOn } from 'src/app/core/constants/constant';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { QuotationV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/quotation-service/quotation-service-v2';

@Component({
  selector: 'app-new-quotation-v2-crane-balance-terms',
  templateUrl: './new-quotation-v2-crane-balance-terms.component.html',
  styleUrls: ['./new-quotation-v2-crane-balance-terms.component.scss']
})
export class NewQuotationV2CraneBalanceTermsComponent implements OnInit {

  constructor(private _quotationV2Service: QuotationV2Service,private _currency: CurrencyService) { }

  @Input() quotationDetail: any

  calculations: any;
  vehObject: any;
  quotationBasedOn: 'hour' | 'day' = 'day'
  shift:'Double Shift'|'Single Shift'
  totalHours=''
  quotationDocuments :any[]=[] 
  rateCardBilling = new RateCardBillingBasedOn();
  rateCardBillingHour = this.rateCardBilling.hour
  rateCardBillingDays = this.rateCardBilling.day
  dailyHours=0
  currency_type

  ngOnInit(): void {
    this.currency_type = this._currency.getCurrency();
    this.calculations = this.quotationDetail[this.quotationDetail.vehicle_category.toLowerCase() + '_calculations']
    this.vehObject = this.quotationDetail[this.quotationDetail.vehicle_category.toLowerCase()];
    this.getQuotationDocuments();
    this.shift=this.vehObject['rental_charge']['no_of_shifts']
    this.quotationBasedOn=this.vehObject['rental_charge']['billing_unit']
    this.getQuotationHours(this.vehObject['working_duration']);

  }

  findCategory(type) {
    if (type == 0) {
      return 'truck'
    } else if (type == 1) {
      return 'crane'
    } else if (type == 2) {
      return 'awp'
    }
  }
  getWorkDuration( item:any ){
    if (!item.duration || !item.working) {
      return "-";
    }
    const units: Record<string, string> = {
      daily: "Day",
      weekly: "Week",
      monthly: "Month",
    };
  
    const unit = units[item.working] || "";
    return unit ? `${item.duration} ${unit}${item.duration > 1 ? "s" : ""}` : "-";

}
  getQuotationHours(item: any) {

    if (!item.duration || !item.working) {
      return "-"
    }
    const units: Record<string, string> = {
      daily: "day",
      weekly: "week",
      monthly: "month",
    };
    let dailyHours=0;
    let weeklyHours=0;
    let monthlyHours=0;
    if(this.quotationBasedOn=='hour'){
      if(this.shift=='Double Shift'){
        this.rateCardBillingHour.day*=2;
        this.rateCardBillingHour.week*=2;
        this.rateCardBillingHour.month*=2;
      }
      dailyHours= this.rateCardBillingHour.day;
      weeklyHours= this.rateCardBillingHour.week;
      monthlyHours=this.rateCardBillingHour.month
    }else{
      dailyHours= this.rateCardBillingDays.day;
      weeklyHours= this.rateCardBillingDays.week;
      monthlyHours=this.rateCardBillingDays.month
    }
    const hoursMapping: Record<string, number> = {
      daily: dailyHours,
      weekly: weeklyHours,
      monthly: monthlyHours,
    };
    this.dailyHours=dailyHours
    if(this.shift=='Double Shift'){
      this.dailyHours*=2
    }
    const unit = units[item.working] || "";
    const hoursPerUnit = hoursMapping[item.working] || 0;
    const totalHours = hoursPerUnit * item.duration;
    const plural = item.duration > 1 ? "s" : "";
    if(this.quotationBasedOn=='day'){
      this.totalHours= `${item.duration} ${unit}${plural} x ${hoursPerUnit/dailyHours} Days = ${totalHours/dailyHours} Days`;
    }
    if(this.quotationBasedOn=='hour'){
      this.totalHours= `${item.duration} ${unit}${plural} x ${hoursPerUnit} hours = ${totalHours} hours`;
    }
  }

  fileUploader(e) {
    let documents = [];
    e.forEach(element => {
      documents.push(element.id);
      element['presigned_url'] = element['url']
      this.quotationDocuments.push(element)
    });
    let payload = {
      documents: documents
    }
    this._quotationV2Service.uploadQuotationDocument(this.quotationDetail.id, payload).subscribe(resp => {
    });
  }

  getQuotationDocuments() {
    this._quotationV2Service.getUploadedQuotationDocuments(this.quotationDetail.id).subscribe(resp => {
      this.quotationDocuments = resp['result']['doc'];
    });
  }

  fileDeleted(id) {
    this.quotationDocuments = this.quotationDocuments.filter(doc => doc.id != id);
    this._quotationV2Service.deleteUploadedQuotationDocuments(id).subscribe(resp => {
    });
  }
}
