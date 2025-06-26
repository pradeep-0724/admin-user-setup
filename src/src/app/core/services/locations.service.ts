import { BASE_API_URL, TSAPIRoutes } from './../constants/api-urls.constants';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationsService {

  constructor(
    private _httpService: HttpClient
  ) { }

  getDistricts(stateUUID): Observable<any> {
    return this._httpService.get(BASE_API_URL + TSAPIRoutes.districts + stateUUID + '/');
  }

  getCities(stateUUID): Observable<any> {
    return this._httpService.get(BASE_API_URL + TSAPIRoutes.cities + stateUUID + '/');
  }
}
