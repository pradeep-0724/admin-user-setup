import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { BASE_API_URL } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor( private _http: HttpClient) { }


  postValidations(url,body): Observable<any>{
    return this._http.post(BASE_API_URL+url,body)
  }

  getValidations(url,id): Observable<any>{
    return this._http.get(BASE_API_URL+url+id+'/')
  }

  putValidations(url,body): Observable<any>{
    return this._http.post(BASE_API_URL+url,body)
  }

  getValidationsList(url): Observable<any>{
    return this._http.get(BASE_API_URL+url)
  }

  deleteValidation(url,id): Observable<any>{
    return this._http.delete(BASE_API_URL+url+id+'/')
  }
}