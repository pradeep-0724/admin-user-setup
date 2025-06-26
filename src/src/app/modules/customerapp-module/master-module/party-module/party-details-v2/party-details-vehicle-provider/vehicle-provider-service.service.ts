import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class VehicleProviderService {

  constructor(private _http:HttpClient) { }

  getTripHead(id,params):Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.report+ TSAPIRoutes.vendor+ "vp/trip/head/" + id + '/',{params});
  }

  getTripList(id,params):Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.report+ TSAPIRoutes.vendor+ "vp/trip/summary/" + id + '/',{params});
  }
}
