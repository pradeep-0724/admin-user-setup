import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleTripPreferenceService {

  constructor(
    private _http: HttpClient
  ) { }

  podReceivedToggle(data): Observable<any> {
    return this._http.post(BASE_API_URL +TSAPIRoutes.revenue_vehicle_trip_setting,data)
  }

  settings(): Observable<any> {
    return this._http.get(BASE_API_URL +TSAPIRoutes.revenue_vehicle_trip_setting)
  }

}

