import { Component, Input, OnInit } from '@angular/core';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { TaxService } from 'src/app/core/services/tax.service';

@Component({
  selector: 'app-invoice-details-item-others',
  templateUrl: './invoice-details-item-others.component.html',
  styleUrls: ['./invoice-details-item-others.component.scss']
})
export class InvoiceDetailsItemOthersComponent implements OnInit {
  @Input() invoiceDetail
  otherList=[];
  currency_type:any
  isTax=false;
  constructor(private currency:CurrencyService,private _taxService:TaxService) { }

  ngOnInit(): void {
    this.otherList=this.invoiceDetail['table_data']['item_others']
    this.currency_type = this.currency.getCurrency();
    this.isTax=this._taxService.getTax()
  }

}
