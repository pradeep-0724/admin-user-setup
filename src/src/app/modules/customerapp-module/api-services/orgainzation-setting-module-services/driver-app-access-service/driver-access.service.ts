import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class DriverAccessService {

  constructor(private _http:HttpClient) { }

  getDriverList():Observable<any>{
    return this._http.get(BASE_API_URL+TSAPIRoutes.company_driver_app+'employee/dropdown/')
  }

  getDriverUserList(params):Observable<any>{
    return this._http.get(BASE_API_URL+TSAPIRoutes.company_driver_app+'user-list/',{params : params})
  }

  createDriverAppUser(body):Observable<any>{
    return this._http.post(BASE_API_URL+TSAPIRoutes.company_driver_app+'user/create/',body)
  }

  createAuthKey(body):Observable<any>{
    return this._http.post(BASE_API_URL+TSAPIRoutes.company_driver_app+'send/otp/',body)
  }

  appUserStatus(body):Observable<any>{
    return this._http.post(BASE_API_URL+TSAPIRoutes.company_driver_app+'user/status/',body)
  }

  checkDriverMobileNumber(body):Observable<any>{
    return this._http.post(BASE_API_URL+TSAPIRoutes.company_driver_app+'check/mobile/unique/',body)
  }
}
