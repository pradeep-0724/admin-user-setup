import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { BASE_API_URL } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class VehicleSettingService {

  constructor( private _http: HttpClient) { }


  getVehicleSettings(): Observable<any>{
    return this._http.get(BASE_API_URL+'vehicle/setting/')
  }

  updateVehicleSettings(body): Observable<any>{
    return this._http.post(BASE_API_URL+'vehicle/setting/',body)
  }
}

