import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OpeningBalanceService {
  constructor(private _http: HttpClient) {}

  postOpeningBalance(request,dateParams): Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.coa_account_op_bal, request, {params:dateParams});
  }
  getCoaAvailableBal(params?: any): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.coa_account_op_bal, {params:params});
  }
  postOpeningBalanceNewAccount(params): Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.coa_new_acc, params);
  }

  updateOpeningBalanceAccount(request: any , coaId : string): Observable<any> {
    return this._http.put(BASE_API_URL + TSAPIRoutes.coa_new_acc + coaId + '/', request);
  }

  getOpeningBalanceAccountById(ob_id) {
    return this._http.get(BASE_API_URL + TSAPIRoutes.coa_new_acc + ob_id + '/');
  }
  getOpeningBalanceAccount() {
    return this._http.get(BASE_API_URL + TSAPIRoutes.coa_new_acc);
  }

  getObAccounts(): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.chart_of_account);
  }

  getAccountsByType(params?: any) {
    return this._http.get(BASE_API_URL + TSAPIRoutes.chart_of_account, {params: {q: params}});
  }

  // deleteCoaAccount(params?: any) {
  //   return this._http.delete(BASE_API_URL + TSAPIRoutes.chart_of_account, {params: {q: params}});
  // }
  deleteCoaAccount(coaId : string): Observable<any> {
    return this._http.delete(BASE_API_URL + TSAPIRoutes.coa_new_acc + coaId + '/',);
  }

  getAllAccountsType() {
    return this._http.get(BASE_API_URL + TSAPIRoutes.chart_of_account_type);
  }

  getAccountTransaction(account_id, dateParams) {
    return this._http.get(BASE_API_URL + TSAPIRoutes.account_transaction + account_id + '/', {params: dateParams});
  }

  getCOAExport (key,dateParams) :Observable<Blob>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.revenue+"account/transaction/"+key+"/",{params:{start_date:dateParams.start_date,end_date:dateParams.end_date,export:true},responseType: 'blob'});
}

getOpeningBalanceAccountList(params) {
  return this._http.get(BASE_API_URL + TSAPIRoutes.coa_new_acc+'list/',{params});
}
}
