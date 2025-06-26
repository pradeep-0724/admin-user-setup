import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: "invoicePaymentListFilter"
})

export class InvoicePaymentListFilterPipe implements PipeTransform {
  transform(value:any[],searchString:string ){
    if(!searchString){
      return value
    }

    return value.filter((it) => {
      const display_name = it.party.display_name.toLowerCase().includes(searchString.toLowerCase());
      const account_num =it.account? it.account.display_name.toLowerCase().includes(searchString.toLowerCase()):false;
      const payment_number = it.payment_number.toLowerCase().includes(searchString.toLowerCase());
      const status = it.status ? it.status.label.toLowerCase().includes(searchString.toLowerCase()): false;
      const payment_mode = it.payment_choice ? it.payment_choice.label.toLowerCase().includes(searchString.toLowerCase()): false;
      return display_name || payment_number || status || payment_mode||account_num ;
    });
  }
}
