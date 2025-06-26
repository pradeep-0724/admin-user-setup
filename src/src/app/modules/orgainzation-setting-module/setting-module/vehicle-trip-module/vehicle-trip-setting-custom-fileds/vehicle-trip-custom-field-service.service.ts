import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleTripCustomFieldService {

  constructor(
    private _http: HttpClient
  ) { }


  getCompanyTripFields(to_add): Observable<any> {
    return this._http.get(BASE_API_URL +TSAPIRoutes.revenue_formfield_vehicle_trip,{params:{to_add}})
  }

  getTripCustomFields(trip_id): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.revenue_formfield_trip + trip_id + '/', {params:{to_add: "false"}})
  }

  allDisplayToggle(data): Observable<any> {
    return this._http.post(BASE_API_URL +TSAPIRoutes.revenue_vehicle_trip_setting,data)
  }

  singleDisplayToggle(id,data): Observable<any> {
    return this._http.put(BASE_API_URL +TSAPIRoutes.revenue_formfield_vehicle_trip+id+'/',data)
  }
  
  deleteCustomFiled(id): Observable<any> {
    return this._http.delete(BASE_API_URL +TSAPIRoutes.revenue_formfield_vehicle_trip+id+'/')
  }

}

