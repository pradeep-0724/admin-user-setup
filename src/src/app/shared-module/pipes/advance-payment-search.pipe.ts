import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: "advancePaymentListFilter"
})

export class AdvanceListFilterPipe implements PipeTransform {
  transform(value:any[],searchString:string ){
    if(!searchString){
      return value
    }

    return value.filter((it) => {
      const advance_number = it.advance_number.toLowerCase().includes(searchString.toLowerCase());
      const display_name = it.party?it.party.display_name.toLowerCase().includes(searchString.toLowerCase()):false;
      const status = it.status ? it.status.label.toLowerCase().includes(searchString.toLowerCase()): false;
      const payment_mode = it.payment_mode ? it.payment_mode.name.toLowerCase().includes(searchString.toLowerCase()): false;



      return advance_number || display_name || status || payment_mode;
    });
  }
}
