import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class PartySettingService {

  constructor( private _http: HttpClient) { }


  getPartySettings(): Observable<any>{
    return this._http.get(BASE_API_URL+'party/setting/')
  }

  updatePartySettings(body): Observable<any>{
    return this._http.post(BASE_API_URL+'party/setting/',body)
  }

  addPartyCustomField(body): Observable<any>{
    return this._http.post(BASE_API_URL+'party/formfield/party/',body)
  }

  editPartyCustomField(id,body): Observable<any>{
    return this._http.put(BASE_API_URL+'party/formfield/party/'+id+'/',body)
  }

  getPartyCustomFields(to_add): Observable<any> {
    return this._http.get(BASE_API_URL +TSAPIRoutes.revenue_party_setting,{params:{to_add}})
  }

  deletePartyCustomField(id): Observable<any> {
    return this._http.delete(BASE_API_URL +TSAPIRoutes.revenue_party_setting+id+'/')
  }

  partyCustomFieldsDataforEdit(id): Observable<any> {
    return this._http.get(BASE_API_URL +'party/party_new/customfield/'+id+'/')
  }
}

