import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CurrencyService {
  currencyType={symbol:''}
  setCurrency(symbol){
    this.currencyType={symbol:symbol};
  }
  getCurrency(){
    return this.currencyType
  }
}
