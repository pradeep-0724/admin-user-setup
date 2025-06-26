import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { CurrencyService } from 'src/app/core/services/currency.service';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {

  @Input() response: any = {};
  @Input() expandAll= false;
  possibleNestedItems : any = ['accounts'];
  currency_type;
  constructor( private currency:CurrencyService) { }

  ngOnInit() {
     setTimeout(() => {
      this.currency_type = this.currency.getCurrency();
    }, 1000);
  }

  isArray(item){
    if(this.possibleNestedItems.indexOf(item.key) > -1 && item.value.length>0){
      return true;
    }
  }
  calculateCreditChildrenTotal(accounts) {
    let total = 0;
    accounts.value.forEach(item => {
      if(item.amount && item.amount.credit) {
        total += item.amount.credit;
      }
    });
    return total;
  }

  calculateDebitChildrenTotal(accounts) {
    let total = 0;
    accounts.value.forEach(item => {
      if(item.amount && item.amount.debit) {
        total += item.amount.debit;
      }
    });
    return total;
  }
  
  ngOnChanges(changes: SimpleChanges): void {
   this.response.show= this.expandAll;

  }

  fixedTo3Decimal(value){
    return Number(value).toFixed(3)
   }

}
