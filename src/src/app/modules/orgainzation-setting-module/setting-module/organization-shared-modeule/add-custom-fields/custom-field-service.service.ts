import { BASE_API_URL} from 'src/app/core/constants/api-urls.constants';
import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CustomFieldServiceService {
  constructor(private _http: HttpClient) { }

  addCustomFiled(url,data):Observable<any>{
    return this._http.post(BASE_API_URL + url,data);
  }

  editCustomFiled(url,data,id):Observable<any>{
    return this._http.put(BASE_API_URL+url+id+'/',data);
  }

}
