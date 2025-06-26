import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn:'root'
})
export class TdsService {

    constructor(
        private _http: HttpClient
    ) { }

    getTdsPayable (params?: any) {
        return this._http.get(BASE_API_URL + TSAPIRoutes.report_tds_payable,{params: params});
    }

    downloadTdsPayable (params?: any):Observable<Blob> {
        return this._http.get(BASE_API_URL + TSAPIRoutes.report_tds_payable, {params: params, responseType: "blob"});
    }

    getTdsReceivable (params?: any) {
        return this._http.get(BASE_API_URL + TSAPIRoutes.report_tds_receivable,{params: params});
    }

    downloadTdsReceivable (params?: any):Observable<Blob> {
        return this._http.get(BASE_API_URL + TSAPIRoutes.report_tds_receivable, {params: params, responseType: "blob"});
    }
}
