import { Component, Input, OnInit } from '@angular/core';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';

@Component({
  selector: 'app-quotation-v2-calculation-section',
  templateUrl: './quotation-v2-calculation-section.component.html',
  styleUrls: ['./quotation-v2-calculation-section.component.scss']
})
export class QuotationV2CalculationSectionComponent implements OnInit {
  @Input() quotationDetail:any
  currency_type: any 
  terminology : any;
  isTax:boolean=false;
  constructor(private currency: CurrencyService, private _terminologiesService:TerminologiesService,private _isTax: TaxService,) { }

  ngOnInit(): void {
    this.isTax = this._isTax.getTax();
    this.currency_type = this.currency.getCurrency();
    this.terminology = this._terminologiesService.terminologie;
  }

}
