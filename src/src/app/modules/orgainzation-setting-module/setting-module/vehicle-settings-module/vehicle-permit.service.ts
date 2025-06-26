import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_API_URL } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class VehiclePermitService {
  constructor(private _http: HttpClient) {}
 
  addPermit(data): Observable<any> {
    return this._http.post(BASE_API_URL + 'vehicle/permit/',data);
  }

  getPermitList(): Observable<any> {
    return this._http.get(BASE_API_URL + 'vehicle/permit/',);
  }

  updatePermit(id,data): Observable<any> {
    return this._http.put(BASE_API_URL + 'vehicle/permit/'+id+'/',data);
  }


  getPermit(id): Observable<any> {
    return this._http.get(BASE_API_URL + 'vehicle/permit/'+id+'/');
  }

  deletePermit(id): Observable<any> {
    return this._http.delete(BASE_API_URL + 'vehicle/permit/'+id+'/',{});
  }

  updateExpiryDateMandatory(id,value): Observable<any> {
    return this._http.put(BASE_API_URL + 'vehicle/permit/'+id+'/'+value+'/',{});
  }
}

