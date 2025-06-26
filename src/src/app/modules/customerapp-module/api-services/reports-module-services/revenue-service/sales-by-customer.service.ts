import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class SalesByCustomerService {
  constructor(private _http:HttpClient) { }
  // revenue/client/head/?
  getsalesByCustomerReportHead(params):Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.revenue+TSAPIRoutes.client+'head/' ,{params});
  }

  getsalesByCustomerReportList(params):Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.revenue+TSAPIRoutes.client+ 'summary/',{params});
  }
}
