import { Component, Input, OnInit } from '@angular/core';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';

@Component({
  selector: 'app-new-quotation-v2-trailer-billing-calculation',
  templateUrl: './new-quotation-v2-trailer-billing-calculation.component.html',
  styleUrls: ['./new-quotation-v2-trailer-billing-calculation.component.scss']
})
export class NewQuotationV2TrailerBillingCalculationComponent implements OnInit {
  @Input() quotationDetail;any;
  currency_type: any 
  isTax:boolean=false;
  terminology:any
  constructor(private currency: CurrencyService,private _isTax: TaxService,private _terminologiesService:TerminologiesService) { }

  ngOnInit(): void {
    this.isTax = this._isTax.getTax();
    this.currency_type = this.currency.getCurrency();
    this.terminology = this._terminologiesService.terminologie;


  }
  findCategory(type){
    if (type==3){
      return 'loose_cargo'
    }else if (type==4){
      return 'container'
    }
  }

}
