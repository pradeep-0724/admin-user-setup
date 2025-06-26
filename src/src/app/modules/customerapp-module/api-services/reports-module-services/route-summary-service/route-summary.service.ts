import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { TSAPIRoutes, BASE_API_URL } from 'src/app/core/constants/api-urls.constants';

@Injectable()

export class RouteSummaryService {

    constructor(private _http: HttpClient){

    }

    getRouteSummary(startDate, endDate): Observable<any> {
        return this._http.get(BASE_API_URL  + TSAPIRoutes.report + "route_summary/", {params: {start_date: startDate, end_date: endDate}})
    }

    getRouteSummaryExcel(startDate, endDate){
        return this._http.get(BASE_API_URL + TSAPIRoutes.report + "route_summary/",{params:{start_date: startDate, end_date: endDate,export:'true'},responseType: 'blob'})
      }

}
