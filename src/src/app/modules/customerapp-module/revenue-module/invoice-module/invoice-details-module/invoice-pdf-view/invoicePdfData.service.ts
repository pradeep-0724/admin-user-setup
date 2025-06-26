import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoicePdfDataService{
    protected pdfData= new Subject();
    newPdfDataInvoice= this.pdfData.asObservable(); 
    constructor(
    ) { }
  
     newPdfData(val:any){
      this.pdfData.next(val)
   }
}