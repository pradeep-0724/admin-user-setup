import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillOfSupplyService {

  constructor(private _http: HttpClient) { }

  saveBillOfSupply(payload): Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.bill_of_supply, payload);
  }

  getBosTypesCount(start_date,end_date):Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.bill_of_supply+ TSAPIRoutes.status_count,{ params: { start_date,end_date}});
  }

  saveBillOfAsDraft(payload): Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.bill_of_supply_draft, payload);
  }

  getBillOfSupply(params): Observable<any> {
    let apiUrl = BASE_API_URL + TSAPIRoutes.bill_of_supply+TSAPIRoutes.list;
    return this._http.get(apiUrl,{ params});
  }

  getBillOfSupplyPrintView(id): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.bill_of_supply + id + '/printview/');
  }

  getBillOfSupplyById(id): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.bill_of_supply + id + '/');
  }

  saveBillOfSupplyById(payload, id): Observable<any> {
    return this._http.put(BASE_API_URL + TSAPIRoutes.bill_of_supply + id + '/', payload);
  }

  saveBillOfSupplyByIdDraft(payload, id): Observable<any> {
    return this._http.put(BASE_API_URL + TSAPIRoutes.bill_of_supply + id + '/' + 'draft/',  payload);
  }

  getPartyBillOfSupply(id, params): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + 'bos_by_party/' + id + '/', {params: {status: params}});
  }

  getPartyUnpaidBillOfSupply(id): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + 'bos_by_party/unpaid/' + id + '/');
  }

  getBillOfSupplyExport(start_date,end_date) :Observable<Blob>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.bill_of_supply+ 'extract/',{params:{start_date,end_date},responseType: 'blob'});
  }

  deleteBoS(bos_id: String) {
		return this._http.request(
			'delete',
			BASE_API_URL + TSAPIRoutes.bill_of_supply,
			{
				body: {
					bos_id: [
						bos_id
					]
				}
			}
		);
  }

  getSuggestedIds(keysRequired): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.suggested_ids + '?key=' + keysRequired)
}
}
