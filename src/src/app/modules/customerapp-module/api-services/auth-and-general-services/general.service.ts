import { BASE_API_URL, TSAPIRoutes } from '../../../../core/constants/api-urls.constants';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(
    private _http: HttpClient
  ) { }

  getGPSAccessKey(): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.gps);
  }


}
