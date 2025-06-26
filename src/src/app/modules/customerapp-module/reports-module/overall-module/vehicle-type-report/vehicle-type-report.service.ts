import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class VehicleTypeReportService {
  constructor(private _http:HttpClient) { }

  getVehicleTypeReportHead(params):Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.revenue+ 'trip_vehicle/head/',{params});
  }

  getVehicleTypeReportList(params):Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.revenue+ 'trip_vehicle/summary/',{params});
  }
}
