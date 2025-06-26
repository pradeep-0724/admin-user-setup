import { BASE_API_URL } from 'src/app/core/constants/api-urls.constants';
import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CalenderService {
  constructor(
    private _http: HttpClient
  ) { }

  getCalenderNotifications(start_date,end_date): Observable<any>{
    return this._http.get(BASE_API_URL+'company/calendar/notifications/',{params: {start_date:start_date,end_date:end_date}})
  }

  getCalenderNotificationsDetails(date): Observable<any>{
    return this._http.get(BASE_API_URL+'company/calendar/notifications/',{params: {date:date}})
  }
  getCalenderNotificationsDetailsLastLevel(date,level): Observable<any>{
    return this._http.get(BASE_API_URL+'company/calendar/notifications/',{params: {date:date,level:level}})
  }


  getCalendarList(params): Observable<any>{
    return this._http.get(BASE_API_URL+'vehicle/calendar/list/',{params:params})
  }

  getCalendarTaskDetails(id): Observable<any>{
    return this._http.get(BASE_API_URL+'vehicle/calendar/detali/'+id+"/")
  }

  bookVehicle(body): Observable<any>{
    return this._http.post(BASE_API_URL+'vehicle/calendar/block/',body)
  }
  putbookVehicle(id,body): Observable<any>{
    return this._http.put(BASE_API_URL+'vehicle/calendar/block/'+id+"/",body)
  }

  deleteBooked(id): Observable<any>{
    return this._http.delete(BASE_API_URL+'vehicle/calendar/block/'+id+"/")
  }
  getVehicleBooked(id): Observable<any>{
    return this._http.get(BASE_API_URL+'vehicle/calendar/block/'+id+"/")
  }

}
