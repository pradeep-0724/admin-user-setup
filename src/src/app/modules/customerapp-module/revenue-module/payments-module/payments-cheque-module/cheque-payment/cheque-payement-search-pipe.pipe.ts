import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chequePayementSearchPipe'
})
export class ChequePayementSearchPipePipe implements PipeTransform {

  transform(value:any[],searchString:string ){

    if(!searchString){
      return value
    }
    return value.filter(it=>{
        const cheque_date = it.cheque_date? it.cheque_date.toLowerCase().includes(searchString.toLowerCase()):false;
        const cheque_no = it.cheque_no.toLowerCase().includes(searchString.toLowerCase());
        const party_name = it.party.toLowerCase().includes(searchString.toLowerCase());
        const payment_no = it.payment_no.toLowerCase().includes(searchString.toLowerCase());
        const status = it.cheque_status.label.toLowerCase().includes(searchString.toLowerCase());
        const bank_account_number = it.account? it.account.label.toLowerCase().includes(searchString.toLowerCase()):false;
        return ( cheque_date || cheque_no || party_name || payment_no||status||bank_account_number);
    });
 }

}
