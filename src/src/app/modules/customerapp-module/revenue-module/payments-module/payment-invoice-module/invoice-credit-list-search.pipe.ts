import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: "invoicecreditListFilter"
})

export class InvoiceCreditListFilterPipe implements PipeTransform {
  transform(value:any[],searchString:string ){
    if(!searchString){
      return value
    }

    return value.filter((it) => {
      const credit_note_number = it.credit_note_number.toLowerCase().includes(searchString.trim().toLowerCase());
      const display_name = it.party?it.party.party.toLowerCase().includes(searchString.trim().toLowerCase()):false;
      const status = it.status ? it.status.label.toLowerCase().includes(searchString.toLowerCase()): false;
      const invoice = it.invoice ? it.invoice.invoice_number.toLowerCase().includes(searchString.toLowerCase()): false;


      return display_name || credit_note_number || status || invoice;
    });
  }
}
