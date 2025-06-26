import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: "bankListFilter"
})

export class BankListFilterPipe implements PipeTransform {
  transform(value:any[],searchString:string ){
    if(!searchString){
      return value
    }

    return value.filter((it) => {
        const account_holder_name = it.account_holder_name?it.account_holder_name.toLowerCase().includes(searchString.toLowerCase()):false;
        const account_number = it.account_number?it.account_number.toLowerCase().includes(searchString.toLowerCase()):false;
        const bank_name = it.bank_name?it.bank_name.label.toLowerCase().includes(searchString.toLowerCase()):false;
        const ifsc_code = it.ifsc_code?it.ifsc_code.toLowerCase().includes(searchString.toLowerCase()):false;
        return account_holder_name || account_number || bank_name || ifsc_code;
    })
  }
}
