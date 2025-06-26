import { BASE_API_URL} from 'src/app/core/constants/api-urls.constants';
import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaxModuleServiceService {
  constructor(
    private _http: HttpClient
  ) { }

  getTaxOptions(countrytId):Observable<any>{
    return this._http.get(BASE_API_URL+'tax/options/?q='+countrytId)
  }

  getTaxDetails():Observable<any>{
    return this._http.get(BASE_API_URL+'tax/form/options/')
  }
}

