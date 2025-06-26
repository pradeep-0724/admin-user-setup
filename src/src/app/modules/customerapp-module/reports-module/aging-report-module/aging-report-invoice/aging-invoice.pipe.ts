import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: "invoiceAgingSearch"
})

export class InvoiceAgingSearch implements PipeTransform {

    transform(value:any[],searchString:string ){

       if(!searchString){
         return value  
       }
       return value.filter(it=>{   
           const invoice_date = it.invoice_date.toString().toLowerCase().includes(searchString.toLowerCase());
           const due_date = it.due_date.toString().toLowerCase().includes(searchString.toLowerCase());
           const invoice_number = it.invoice_number.toString().toLowerCase().includes(searchString.toLowerCase());
           const party = it.party.display_name.toString().toLowerCase().includes(searchString.toLowerCase());
           const total_amount = it.total_amount.toString().toLowerCase().includes(searchString.toLowerCase());
           const age = it.age.toString().toLowerCase().includes(searchString.toLowerCase());
           const balance = it.balance.toString().toLowerCase().includes(searchString.toLowerCase());
           const status = it.status ? it.status.label.toLowerCase().includes(searchString.toLowerCase()): false;
           return ( invoice_date || status||due_date||invoice_number||party||balance||total_amount||age);      
       });
    }
}