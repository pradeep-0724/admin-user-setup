import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TaxService {
  tax:boolean = false;
  vat:boolean = false;
  isPos:boolean = false;
  isIban: boolean = false;

  setTax(tax:boolean){
    this.tax=tax
  }
  getTax():boolean{
    return this.tax
  }

  setVat(vat:boolean){
    this.vat=vat
  }

  getVat():boolean{
    return this.vat
  }

  setPos(isPos:boolean){
   this.isPos = isPos
  }
  
  getIban():boolean{
    return this.isIban
  }

  setIban(isIban:boolean){
    this.isIban = isIban
   }

  isPlaceOfSupply():boolean{
    return this.isPos;
  }
}
