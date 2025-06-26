import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeAttendenceService {

  constructor(
    private _http: HttpClient
  ) { }

  getEmployeeAttendence(on_date): Observable<any>{
     return this._http.get(BASE_API_URL+TSAPIRoutes.employee_attendance,{params: {on_date:on_date}})
  }

  postEmployeeAttendence(data): Observable<any>{
    return this._http.post(BASE_API_URL+TSAPIRoutes.employee_attendance,data)
 }

 getEmployeeAttendenceForMonth(start_date,end_date): Observable<any>{
  return this._http.get(BASE_API_URL+TSAPIRoutes.employee_attendance,{params: {start_date:start_date,end_date:end_date}})
}

}
