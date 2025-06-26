import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn:'root'
})
export class AgingReportService {

    constructor(
        private _http: HttpClient
    ) { }

    getAgingReport (screen,queryParams):Observable<any> {
        return this._http.get(BASE_API_URL + TSAPIRoutes.revenue+screen,{params:queryParams});
    }
    getAgingReportBills (queryParams):Observable<any> {
        return this._http.get(BASE_API_URL + TSAPIRoutes.operation +'ageing_bills/',{params:queryParams});
    }

    getAgingReportDownload(screen,queryParams):Observable<any> {
        return this._http.get(BASE_API_URL + TSAPIRoutes.revenue+screen,{params:queryParams,responseType: 'blob'});
    }

    getAgingReportExport (queryParams) :Observable<Blob>{
        return this._http.get(BASE_API_URL + TSAPIRoutes.revenue +'ageing_bills/',{params:queryParams,responseType: 'blob'});
    }

    getAgingReportOperationsExport (queryParams) :Observable<Blob>{
        return this._http.get(BASE_API_URL + TSAPIRoutes.operation +'ageing_bills/',{params:queryParams,responseType: 'blob'});
    }
}
