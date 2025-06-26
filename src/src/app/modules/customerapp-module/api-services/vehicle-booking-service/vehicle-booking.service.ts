import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class VehicleBookingService {

  constructor(
    private _http: HttpClient
  ) { }

  getVehicleBookingDetails(start_date,end_date): Observable<any>{
     return this._http.get(BASE_API_URL+ TSAPIRoutes.revenue+TSAPIRoutes.booking_calendar_notifications,{params: {start_date:start_date,end_date:end_date}})
  }

  postVehicleBooking(body): Observable<any>{
    return this._http.post(BASE_API_URL+ TSAPIRoutes.revenue+"booking/",body)

  }

  putVehicleBooking(body,id): Observable<any>{
    return this._http.put(BASE_API_URL+ TSAPIRoutes.revenue+"booking/"+id+"/",body)

  }


  deleteVehicleBooking(id): Observable<any>{
    return this._http.delete(BASE_API_URL+ TSAPIRoutes.revenue+"booking/"+id+"/")

  }

  getVehicleBooking(start_date): Observable<any>{
    return this._http.get(BASE_API_URL+ TSAPIRoutes.revenue+TSAPIRoutes.booking_calendar_notifications,{params: {date:start_date}})

  }

}
