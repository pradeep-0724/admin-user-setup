import { Injectable } from '@angular/core';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor( private _http :HttpClient) { }


postEmail(body):Observable<any>{
  return this._http.post(BASE_API_URL +TSAPIRoutes.company_email,body)
}
}
