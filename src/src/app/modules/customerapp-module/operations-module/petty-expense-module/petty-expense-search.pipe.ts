import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: "pettyExpenseListFilter"
})

export class PettyExpenseListFilterPipe implements PipeTransform {
  transform(value:any[],searchString:string ){
    if(!searchString){
      return value
    }

    return value.filter((it) => {
      const payment_mode = it.payment_mode.name.toLowerCase().includes(searchString.toLowerCase());
      return payment_mode ;
    });
  }
}
