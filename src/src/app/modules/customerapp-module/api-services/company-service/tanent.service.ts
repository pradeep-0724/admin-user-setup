import { BASE_API_URL } from 'src/app/core/constants/api-urls.constants';

import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TanentService {

  constructor(private _http:HttpClient) { }

  getTenents():Observable<any>{
  return  this._http.get(BASE_API_URL+'user/tenants/')
  }
}
