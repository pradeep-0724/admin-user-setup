import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderCustomFieldService {

  constructor(
    private _http: HttpClient
  ) { }


  getWorkOrderFields(to_add): Observable<any> {
    return this._http.get(BASE_API_URL +TSAPIRoutes.revenue_form_field_workorder,{params:{to_add}})
  }

  allDisplayToggle(data): Observable<any> {
    return this._http.post(BASE_API_URL +TSAPIRoutes.revenue_trip_workorder_setting,data)
  }

  singleDisplayToggle(id,data): Observable<any> {
    return this._http.put(BASE_API_URL +TSAPIRoutes.revenue_form_field_workorder+id+'/',data)
  }
  
  deleteCustomFiled(id): Observable<any> {
    return this._http.delete(BASE_API_URL +TSAPIRoutes.revenue_form_field_workorder+id+'/')
  }

}

