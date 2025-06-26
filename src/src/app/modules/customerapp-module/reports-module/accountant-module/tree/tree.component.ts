import { Component, OnInit, Input } from '@angular/core';
import { CurrencyService } from 'src/app/core/services/currency.service';

@Component({
  selector: 'tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class MainTreeComponent implements OnInit {
  @Input() response: any = {};
  @Input() debitPositive : boolean;
  currency_type;
  possibleNestedItems : any = ['accounts'];

  constructor(  private currency:CurrencyService) { }

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

  returnAbsoluteNumber(amount) {
    return Math.abs(amount);
  }

  identifyAmountType(amount) {
    if(this.debitPositive) {
      if(amount > 0)
      return '(Dr)';
      else if(amount < 0 )
      return '(Cr)';
    }
    else {
      if(amount > 0)
      return '(Cr)';
      else if(amount < 0 )
      return '(Dr)';
    }
  }
}
