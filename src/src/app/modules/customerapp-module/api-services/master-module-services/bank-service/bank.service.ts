import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'any'
})
export class BankService {

  constructor(
    private _http: HttpClient
  ) { }


  makeDefaultBankAccount(id){
    return this._http.put(BASE_API_URL + 'company/bank/default/'+id+'/',{});
  }

  getBankListDetails(params): Observable<any> {
    return this._http.get(BASE_API_URL + 'company/banks/'+TSAPIRoutes.list, {params:params});
  }
  postBankDetails(bankData: any): Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.bank, bankData);
  }

  putBankDetails(bankData: any, bank_id: String): Observable<any> {
    return this._http.put(BASE_API_URL + TSAPIRoutes.bank + bank_id + '/', bankData);
  }

  getSingleBank (bank_id: String) {
    return this._http.get(BASE_API_URL + TSAPIRoutes.bank + bank_id + '/')
  }

  getBankList(): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.bank);
  }

  deleteBank (bank_id: any) {
    return this._http.delete(BASE_API_URL + TSAPIRoutes.bank + bank_id + '/')
  }
}
