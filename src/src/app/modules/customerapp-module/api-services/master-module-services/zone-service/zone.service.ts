import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_API_URL } from './../../../../../core/constants/api-urls.constants';
@Injectable({
  providedIn: 'root'
})
export class ZoneService {  
  constructor(private _http: HttpClient) {}

  checkIsZoneNameUnique(name): Observable<any> {
    let params={
      name : name
    }
    return this._http.get(BASE_API_URL + 'zone/check/name/',{params :params});
  }

  addZone(data): Observable<any> {
    return this._http.post(BASE_API_URL + 'zone/add/',data);
  }

  getZoneList(params): Observable<any> {
    return this._http.get(BASE_API_URL + 'zone/list/',{ params});
  }

  updateZone(id,data): Observable<any> {
    return this._http.put(BASE_API_URL + 'zone/update/'+id+'/',data);
  }


  getZone(id): Observable<any> {
    return this._http.get(BASE_API_URL + 'zone/detali/'+id+'/');
  }

  deleteZone(id): Observable<any> {
    return this._http.delete(BASE_API_URL + 'zone/delete/'+id+'/',{});
  }

  getZoneOnLocation(locationId): Observable<any> {
    return this._http.get(BASE_API_URL + 'zone/area/'+locationId+'/');
  }
}
