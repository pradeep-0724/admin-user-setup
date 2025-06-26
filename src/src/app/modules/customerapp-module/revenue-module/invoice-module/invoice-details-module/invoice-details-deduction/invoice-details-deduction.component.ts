import { Component, Input, OnInit } from '@angular/core';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';

@Component({
  selector: 'app-invoice-details-deduction',
  templateUrl: './invoice-details-deduction.component.html',
  styleUrls: ['./invoice-details-deduction.component.scss']
})
export class InvoiceDetailsDeductionComponent implements OnInit {
  @Input() invoiceDetail
  deductionList=[];
  currency_type:any;
  prefixUrl = getPrefix();
  
  constructor(private currency:CurrencyService) { }

  ngOnInit(): void {
    this.deductionList=this.invoiceDetail['table_data']['deductions']
    this.currency_type = this.currency.getCurrency();
  }

}
