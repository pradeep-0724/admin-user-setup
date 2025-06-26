import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: "quotationSearchPipe"
})

export class QuotationSearchPipe implements PipeTransform {

    transform(value:any[],searchString:string ){

       if(!searchString){
         return value  
       }
       return value.filter(it=>{   
           const quotation_no = it.quotation_no.toLowerCase().includes(searchString.toLowerCase());
           const customer = it.customer.display_name.toLowerCase().includes(searchString.toLowerCase());
           const status = it.status.label.toLowerCase().includes(searchString.toLowerCase());
           return ( quotation_no || customer || status);      
       });
    }
}