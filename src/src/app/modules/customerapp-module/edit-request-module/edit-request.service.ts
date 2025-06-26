import { Injectable } from '@angular/core';
import { BASE_API_URL } from 'src/app/core/constants/api-urls.constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditRequestService {
  constructor(
    private _http: HttpClient
  )
   { }

  sendEditRequest(url,body): Observable<any>{
     return this._http.post(BASE_API_URL+url,body)
  }
}
