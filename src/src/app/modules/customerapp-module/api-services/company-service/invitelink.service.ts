import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_API_URL } from 'src/app/core/constants/api-urls.constants';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class InviteModuleServices {

  constructor(private _http:HttpClient){

  }
  activateLink(key):Observable<any>{
    return this._http.get(BASE_API_URL+'accept/invitation/?q='+key)
  }

}
