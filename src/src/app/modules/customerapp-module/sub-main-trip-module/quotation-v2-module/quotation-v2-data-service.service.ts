import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuotationV2DataService{
 protected quotationUpdate=new Subject();
 newQuotationUpdate= this.quotationUpdate.asObservable(); 

  constructor(
  ) { }



upDateQuotation(update:boolean){  
 this.quotationUpdate.next(update)
}
  
}