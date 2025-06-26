import { Pipe, PipeTransform } from '@angular/core';
import { isValidValue } from '../../../../../shared-module/utilities/helper-utils';

@Pipe({
    name: "otherListActivityFilter"
})

export class OtherListActivityFilter implements PipeTransform {
  transform(value:any[],searchString:string ){
    if(!searchString){
      return value
    }
    return value.filter((it) => {
      const bill_number = it.bill_number.toLowerCase().includes(searchString.toLowerCase());
      const display_name = it.vendor?it.vendor.display_name.toLowerCase().includes(searchString.toLowerCase()):false;
      const item_expenses =isValidValue(it.item_expenses[0].expense_account)?it.item_expenses[0].expense_account.name.toLowerCase().includes(searchString.toLowerCase()):false;
      const payment_status= it.payment_status?it.payment_status.label.toLowerCase().includes(searchString.toLowerCase()):false;
      const item =isValidValue(it.item_expenses[0].item)?it.item_expenses[0].item.name.toLowerCase().includes(searchString.toLowerCase()):false;
      return bill_number || display_name || item_expenses || payment_status ||item;
    });
  }
}
