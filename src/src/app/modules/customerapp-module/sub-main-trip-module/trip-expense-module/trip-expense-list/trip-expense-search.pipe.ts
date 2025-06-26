import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tripExpenseSearch'
})
export class TripExpenseSearchPipe implements PipeTransform {

  transform(value:any[],searchString:string ){
    if(!searchString){
      return value
    }
    return value.filter((it) => {
      const bill_number = it.bill_number.toLowerCase().includes(searchString.toLowerCase());
      const  display_name = it.vendor ? it.vendor.display_name.toLowerCase().includes(searchString.toLowerCase()):false;
      const  payment_status = it.payment_status.toLowerCase().includes(searchString.toLowerCase());
      return bill_number || display_name || payment_status;
    });
  }
}
