import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {

  constructor(
    private _http: HttpClient
  ) { }

  postPurchaseOrder(body): Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.operation +TSAPIRoutes.purchaseorder,body);
  }

  putPurchaseOrder(body,id): Observable<any> {
    return this._http.put(BASE_API_URL + TSAPIRoutes.operation +TSAPIRoutes.purchaseorder+id+'/',body);
  }

  getPurchaseOrder(): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.operation +TSAPIRoutes.purchaseorder);
  }

  deletePurchaseOrder(id): Observable<any> {
    return this._http.delete(BASE_API_URL + TSAPIRoutes.operation +TSAPIRoutes.purchaseorder+id+'/');
  }

  changeStatusPurchaseOrder(id,body): Observable<any> {
    return this._http.put(BASE_API_URL + TSAPIRoutes.operation +TSAPIRoutes.purchaseorder+'status/'+id+'/',body);
  }

  getPurchaseOrderDetail(id): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.operation +TSAPIRoutes.purchaseorder+id+'/');
  }

  getPrintPurchaseOrderDetail(id): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.operation +TSAPIRoutes.purchaseorder+id+'/'+'?add_activity_log=true');
  }

  getPrefixPurchaseOrder(): Observable<any> {
    return this._http.get(BASE_API_URL +  TSAPIRoutes.operation+'suggested_ids/?key=purchase_order');
  }


}
