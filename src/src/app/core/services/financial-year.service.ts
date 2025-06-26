
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FinancialYearService {

protected startEndfinancialYear={
    start:1,
    end:2
}
  constructor() { }

get financialYear(){
   return this.startEndfinancialYear
}
set financialYear(financialYear){
    this.startEndfinancialYear=financialYear
 }
 
}
