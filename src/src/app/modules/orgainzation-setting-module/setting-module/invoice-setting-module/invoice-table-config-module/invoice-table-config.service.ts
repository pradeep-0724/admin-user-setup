import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_API_URL } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class InvoiceTableConfigService {

  constructor(private _http:HttpClient) { }

  getConfigFieldList(url,category):Observable<any>{
    return this._http.get(BASE_API_URL+url,{params:{category}})
  }


  postConfigField(url,body):Observable<any>{
    return this._http.post(BASE_API_URL+url,body)
  }

  putConfigField(url,body):Observable<any>{
    return this._http.put(BASE_API_URL+url,body)
  }

  putConfigFieldOrder(url,category,body):Observable<any>{
    return this._http.put(BASE_API_URL+url+'order/',body,{params:{category}})
  }

  deleteConfigField(url,category,id):Observable<any>{
    return this._http.delete(BASE_API_URL+url+id+'/',{params:{category}})
  }


  


 


}
