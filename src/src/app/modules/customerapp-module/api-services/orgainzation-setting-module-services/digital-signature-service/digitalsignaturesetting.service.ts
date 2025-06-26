import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TSAPIRoutes, BASE_API_URL } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class DigitalSignatureService {

  constructor(private _http:HttpClient) { }

  postDigitalSignature(body):Observable<any>{
    return this._http.post(BASE_API_URL+TSAPIRoutes.setting+'ds/',body)
  }



  getDigitalSignature():Observable<any>{
    return this._http.get(BASE_API_URL+TSAPIRoutes.setting+'ds/')
  }

  deleteDigitalSignature(id):Observable<any>{
    return this._http.delete(BASE_API_URL+TSAPIRoutes.setting+'ds/'+id+"/")
  }

  putDigitalSignature(id,body):Observable<any>{
    return this._http.put(BASE_API_URL+TSAPIRoutes.setting+'ds/'+id+"/",body)
  }

 
}
