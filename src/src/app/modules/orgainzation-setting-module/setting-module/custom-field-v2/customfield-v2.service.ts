import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_API_URL } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class CustomFieldServiceV2 {

  constructor(private _http:HttpClient) { }

  getCustomFieldList(url):Observable<any>{
    return this._http.get(BASE_API_URL+url)
  }


  postCustomField(url,body):Observable<any>{
    return this._http.post(BASE_API_URL+url,body)
  }

  putCustomField(url,body):Observable<any>{
    return this._http.put(BASE_API_URL+url,body)
  }

  putCustomFieldOrder(url,body):Observable<any>{
    return this._http.put(BASE_API_URL+url+'order/',body)
  }

  deleteCustomField(url,id):Observable<any>{
    return this._http.delete(BASE_API_URL+url+id+'/')
  }


  


 


}
