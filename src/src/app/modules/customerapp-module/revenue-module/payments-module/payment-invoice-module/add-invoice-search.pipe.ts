import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: "addInvoiceListFilter"
})

export class AddInvocieListFilterPipe implements PipeTransform {

    transform(value:any[],searchString:string ){

       if(!searchString){
         return value  
       }
       return value.filter(it=>{   
           const invoice_number = it.invoice_number.toString().toLowerCase().includes(searchString.toLowerCase());
           return ( invoice_number);      
       });
    }
}