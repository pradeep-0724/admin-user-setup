import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {TSAPIRoutes, BASE_API_URL} from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class PlacesAutoSearch {

  constructor(
    private _httpService: HttpClient
  ) { }

  searchPlaces(body): Observable<any> {
    return this._httpService.post(BASE_API_URL+ TSAPIRoutes.places,body);
  }

  getAddress(body): Observable<any> {
    return this._httpService.post(BASE_API_URL+ TSAPIRoutes.place,body);
  }

  getAreaGeoCodes(area): Observable<any> {
    return this._httpService.get(BASE_API_URL+ TSAPIRoutes.place+`geocodes/`,{params:area});
  }

  getRecent(): Observable<any> {
    return this._httpService.get(BASE_API_URL+ TSAPIRoutes.places+TSAPIRoutes.recent);
  }

  getAdressFromLatLng(latlng): Observable<any> {
    return this._httpService.get(BASE_API_URL+ TSAPIRoutes.place+'latlng/',{params:{latlng}});
  }
}



