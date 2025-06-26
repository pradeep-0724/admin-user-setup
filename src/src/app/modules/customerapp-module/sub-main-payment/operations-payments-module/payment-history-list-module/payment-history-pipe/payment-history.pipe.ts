import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: "paymentHistoryListFilter"
})

export class PaymentHistoryListFilterPipe implements PipeTransform {

    transform(value:any[],searchString:string ){

       if(!searchString){
         return value
       }

       return value.filter(it=>{
           const display_name = it.party.display_name.toString().toLowerCase().includes(searchString.toLowerCase());
           const payment_no = it.payment_no.toLowerCase().includes(searchString.toLowerCase());
           const payment_mode = it.payment_mode.toLowerCase().includes(searchString.toLowerCase());

           return (display_name || payment_no || payment_mode);
       })
    }
}
