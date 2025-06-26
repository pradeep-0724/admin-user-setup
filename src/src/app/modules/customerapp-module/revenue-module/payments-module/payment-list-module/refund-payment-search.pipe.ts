import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: "refundPaymentListFilter"
})

export class RefundListFilterPipe implements PipeTransform {
  transform(value: any[],searchString: string){ 
    if(!searchString){
      return value
    }

    return value.filter((it) => {
      const display_name = it.party?it.party.display_name.toLowerCase().includes(searchString.toLowerCase()):false;
      const refund_number = it.refund_number.toLowerCase().includes(searchString.toLowerCase());
      const status = it.status ? it.status.label.toLowerCase().includes(searchString.toLowerCase()): false;
      const refund_against = it.refund_against ? it.refund_against.credit_note_number.toLowerCase().includes(searchString.toLowerCase()): false;


      return refund_number || display_name || status ||refund_against;
    });
  }
}
