import { Component, Input, OnInit } from '@angular/core';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { TaxService } from 'src/app/core/services/tax.service';

@Component({
  selector: 'app-invoice-details-calculatios',
  templateUrl: './invoice-details-calculatios.component.html',
  styleUrls: ['./invoice-details-calculatios.component.scss']
})
export class InvoiceDetailsCalculatiosComponent implements OnInit {
  @Input() invoiceDetail
  currency_type:any;
  isTax=false;

  calculationData:any
  constructor(private currency:CurrencyService,private _taxService:TaxService) { }

  ngOnInit(): void {
    this.calculationData=this.invoiceDetail['calculations']
    this.currency_type = this.currency.getCurrency();
    this.isTax=this._taxService.getTax()

  }

}
