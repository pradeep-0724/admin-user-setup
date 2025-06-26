import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {  BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class PermitServiceService {

  constructor(private _http: HttpClient) {}

  postPermitDetails(body): Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.vehicle+TSAPIRoutes.permit,body);
  }
  updatePermitDetails(id,body): Observable<any> {
    return this._http.put(BASE_API_URL + TSAPIRoutes.vehicle+TSAPIRoutes.permit+id+'/',body);
  }
  deletePermitDetails(id): Observable<any> {
    return this._http.delete(BASE_API_URL + TSAPIRoutes.vehicle+TSAPIRoutes.permit+id+'/');
  }
  getPermitDetails(id): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle+TSAPIRoutes.permit+id+'/');
  }
  getAllPermitDetails(): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle+TSAPIRoutes.permit);
  }
  setExpiry(id,body): Observable<any> {
    return this._http.put(BASE_API_URL + TSAPIRoutes.vehicle+TSAPIRoutes.permit+id+'/'+body+'/',{});
  }
}
