import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class PartyDetailsVendorCommonService {
  
  constructor(private _http:HttpClient) { }

  getFuelVendorFuelSummaryHead(id,params):Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.report +TSAPIRoutes.vendor  +  "fuel/head/" + id + '/',{params});
  }

  getFuelVendorFuelSummary(id,params):Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.report +TSAPIRoutes.vendor  +  "fuel/summary/" + id + '/',{params});
  }

  getVendorTransactionHead(id,params):Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.report +TSAPIRoutes.vendor  +  "transaction/head/" + id + '/',{params});
  }

  getVendorTransactionBilling(id,params):Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.report +TSAPIRoutes.vendor  +  "vendor_bills/" + id + '/',{params});
  }

  getVendorTransactionPayment(id,params):Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.report +TSAPIRoutes.vendor  +  "vendor_payments/" + id + '/',{params});
  }

  getVendorCredit(id,params):Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.report +TSAPIRoutes.vendor  +  "vendor_credit/" + id + '/',{params});
  }

  getVendorAdvance(id,params):Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.report +TSAPIRoutes.vendor  +  "vendor_advance/" + id + '/',{params});
  }
}
