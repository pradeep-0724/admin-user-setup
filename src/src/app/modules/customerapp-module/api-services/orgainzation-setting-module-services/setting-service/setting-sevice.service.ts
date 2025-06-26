import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_API_URL } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class SettingSeviceService {

  constructor(private _http:HttpClient) { }

  getPrefix(key):Observable<any>{
    return this._http.get(BASE_API_URL+'company/prefix/?key='+key)
  }

  postPrefix(body):Observable<any>{
    return this._http.post(BASE_API_URL+'company/prefix/',body)
  }

  getPdfHeading(key):Observable<any>{
    return this._http.get(BASE_API_URL+'company/native/?key='+key)
  }

  postPdfHeading(body):Observable<any>{
    return this._http.post(BASE_API_URL+'company/native/',body)
  }

  getGeneralConfigurationData(key):Observable<any>{
    return this._http.get(BASE_API_URL+'setting/tc/?key='+key)
  }

  postGeneralConfigurationData(body):Observable<any>{
    return this._http.post(BASE_API_URL + 'setting/tc/', body)
  }

  getAdvances(key):Observable<any>{
    return this._http.get(BASE_API_URL+'setting/advance/'+key+'/')
  }

  postAdvances(key,body):Observable<any>{
    return this._http.post(BASE_API_URL+'setting/advance/'+key+'/',body)
  }

  get(key):Observable<any>{
    return this._http.get(BASE_API_URL+'setting/advance/'+key+'/')
  }

  getAdvancesSetting():Observable<any>{
    return this._http.get(BASE_API_URL+'setting/advance/')
  }

  getDigitalSignatureSettings(key):Observable<any>{
    return this._http.get(BASE_API_URL+'setting/company_signature/'+key+"/")
  }

  postDigitalSignature(key,body):Observable<any>{
    return this._http.post(BASE_API_URL+'setting/company_signature/'+key+"/",body)
  }

  postBiltySet(body):Observable<any>{
    return this._http.post(BASE_API_URL+'setting/builty_set_handler/',body)
  }

  getBiltySet():Observable<any>{
    return this._http.get(BASE_API_URL+'setting/builty_set_handler/')
  }

  getBiltySetList():Observable<any>{
    return this._http.get(BASE_API_URL+'setting/built_set_list/')
  }

  postBiltySetSeries(body):Observable<any>{
    return this._http.post(BASE_API_URL+'setting/builty_no_from_built_set/',body)
  }

  postTC(body):Observable<any>{
    return this._http.post(BASE_API_URL + 'setting/tc/content/', body)
  }

  updateTC(id, body):Observable<any>{
    return this._http.put(BASE_API_URL + `setting/tc/content/${id}/`, body)
  }

  deleteTC(id):Observable<any>{
    return this._http.delete(BASE_API_URL + `setting/tc/content/${id}/`)
  }

  getTCSettings(key):Observable<any>{
    return this._http.get(BASE_API_URL + 'setting/tc/', {params: {key: key}})
  }

  updateTCSettings(body):Observable<any>{
    return this._http.post(BASE_API_URL + 'setting/tc/', body)
  }

  getApprovals(key): Observable<any>{
    return this._http.get(BASE_API_URL+ `screen/approval/${key}/`)
  }

  getApprovalsSettings(key): Observable<any>{
    return this._http.get(BASE_API_URL+ `screen/approval/${key}/`,{params:{setting:true}})
  }

  updateApproval(key, body): Observable<any>{
    return this._http.post(BASE_API_URL + `screen/approval/${key}/`, body)
  }

  getValidations(key): Observable<any>{
    return this._http.get(BASE_API_URL + `validations/${key}/`)
  }


}
