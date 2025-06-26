import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn:'root'
})
export class GstService {

    constructor(
        private _http: HttpClient
    ) { }

    getGstReceivable (params?: any) {
        return this._http.get(BASE_API_URL + TSAPIRoutes.report_gst_receivable,{params: params});
    }

    getGstPayable (params?: any) {
      return this._http.get(BASE_API_URL + TSAPIRoutes.gst_payable_summary,{params: params});
  }

    downloadGstReceivable (params?: any):Observable<Blob> {
        return this._http.get(BASE_API_URL + TSAPIRoutes.report_gst_receivable, {params: params, responseType: "blob"});
    }

    downloadGstPayable (params?: any):Observable<Blob> {
      return this._http.get(BASE_API_URL + TSAPIRoutes.gst_payable_summary, {params: params, responseType: "blob"});
  }
}
