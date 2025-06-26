import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class OverallTripReportService {

  constructor(private _http:HttpClient) { }

  getOverallTripReportHead(params):Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.report+ 'vp/trip/head/',{params});
  }

  getOverallTripReportVpList(params):Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.report+ 'vp/trip/summary/',{params});
  }

  getOverallTripReportClientHead(params):Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.report+ 'client/trip/head/',{params});
  }

  getOverallTripReportClientList(params):Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.report+ 'client/trip/summary/',{params});
  }

  getOverallTripReportDriversList(params):Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.report+ 'dri/trip/summary/',{params});
  }

  getOverallTripReportDriversHead(params):Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.report+ 'dri/trip/head/',{params});
  }

  getOverallTripReportVehiclesList(params):Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.report+ 'veh/trip/summary/',{params});
  }

  getOverallTripReportVehiclesHead(params):Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.report+ 'veh/trip/head/',{params});
  }

  getOverallTripReportOverviewScheduledTripList(params):Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.report+ 'overview/trip/scheduled_summary/',{params});
  }

  getOverallTripReportOverviewHead(params):Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.report+ 'overview/trip/head/',{params});
  }

  getOverallTripReportOverviewOngoingTripList(params):Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.report+ 'overview/trip/ongonig_summary/',{params});
  }

  getOverallTripReportOverviewBillingTripList(params):Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.report+ 'overview/trip/billing_summary/',{params});
  }
}
