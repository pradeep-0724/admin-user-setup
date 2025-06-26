import { Injectable} from '@angular/core';
import { BASE_API_URL } from 'src/app/core/constants/api-urls.constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsignmentNoteCustomfieldServiceService {
  constructor(
    private _http: HttpClient
  ) { }


  getCompanyTripFields(to_add): Observable<any> {
    return this._http.get(BASE_API_URL +'revenue/formfield/consignmentnote/',{params:{to_add}})
  }

  allDisplayToggle(data): Observable<any> {
    return this._http.post(BASE_API_URL +'revenue/consignmentnote/setting/',data)
  }

  singleDisplayToggle(id,data): Observable<any> {
    return this._http.put(BASE_API_URL +'revenue/formfield/consignmentnote/'+id+'/',data)
  }
  deleteCustomFiled(id): Observable<any> {
    return this._http.delete(BASE_API_URL +'revenue/formfield/consignmentnote/'+id+'/')
  }
}
