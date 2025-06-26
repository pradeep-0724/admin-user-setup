import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BASE_API_URL } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'any'
})
export class GenericCustomFieldService {

  constructor(
    private _http: HttpClient
  ) { }


  getCustomFields(url,to_add): Observable<any> {
    return this._http.get(BASE_API_URL +url,{params:{to_add}})
  }
 
}
