import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_API_URL } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class GenericChecklistServiceService {

  constructor(
    private _http: HttpClient
  ) { }


  getCheckListView(url): Observable<any> {
    return this._http.get(BASE_API_URL +url)
  }

  updateOption(url,body): Observable<any>{
    return this._http.post(BASE_API_URL+url+'update/option/',body)
  }

  getInspectionDetails(url,id): Observable<any>{
    return this._http.get(BASE_API_URL+url+id+"/")
  }
  addInspection(url,body): Observable<any>{
    return this._http.post(BASE_API_URL+url,body)
  }
  editInspection(url,id,body): Observable<any>{
    return this._http.put(BASE_API_URL+url +id+"/",body)
  }
  
}