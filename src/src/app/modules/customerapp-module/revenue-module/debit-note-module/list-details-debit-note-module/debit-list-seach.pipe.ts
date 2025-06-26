import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: "debitListFilter"
})

export class DebitListFilterPipe implements PipeTransform {
  transform(value:any[],searchString:string ){
    if(!searchString){
      return value
    }

    return value.filter((it) => {
      const debit_note_date = it.debit_note_date?it.debit_note_date.toLowerCase().includes(searchString.toLowerCase()):false;
      const debit_note_number = it.debit_note_number?it.debit_note_number.toLowerCase().includes(searchString.toLowerCase()):false;
      const invoice_number = it.invoice?it.invoice.invoice_number.toLowerCase().includes(searchString.toLowerCase()):false;
      const name = it.party?it.party.name.toLowerCase().includes(searchString.toLowerCase()):false;
      const status = it.status?it.status.label.toLowerCase().includes(searchString.toLowerCase()):false;
      return debit_note_date ||
        debit_note_number ||
        invoice_number ||
        name ||
        status;
    });
  }
}
