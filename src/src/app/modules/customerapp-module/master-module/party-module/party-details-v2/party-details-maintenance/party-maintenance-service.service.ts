import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class PartyMaintenanceService {

  constructor(private _http:HttpClient) { }

  getFuelVendorMaintenanceSummaryHead(id,params):Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.report +TSAPIRoutes.vendor  +TSAPIRoutes.maintenance+  "service/head/" + id + '/',{params});
  }

  getFuelVendorMaintenanceSummary(id,params):Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.report +TSAPIRoutes.vendor  + TSAPIRoutes.maintenance+  "service/summary/" + id + '/',{params});
  }

}
