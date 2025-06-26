import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn:'root'
})
export class VatService {

    constructor(
        private _http: HttpClient
    ) { }

    getVatPayable (params?: any) {
        return this._http.get(BASE_API_URL + TSAPIRoutes.report+"vat_payable_summary/",{params: params});
    }

    downloadVatPayable (params?: any):Observable<Blob> {
        return this._http.get(BASE_API_URL + TSAPIRoutes.report+"vat_payable_summary/", {params: params, responseType: "blob"});
    }

    getVatReceivable (params?: any) {
        return this._http.get(BASE_API_URL + TSAPIRoutes.report+"vat_receivable_summary/",{params: params});
    }

    downloadVatReceivable (params?: any):Observable<Blob> {
        return this._http.get(BASE_API_URL + TSAPIRoutes.report+"vat_receivable_summary/", {params: params, responseType: "blob"});
    }

}
