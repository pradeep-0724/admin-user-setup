import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(
    private _http: HttpClient
  ) { }

  getSuggestedIds(keysRequired): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.suggested_ids + '?key=' + keysRequired)
 }
getSuggestedIdsOperation(keysRequired): Observable<any> {
  return this._http.get(BASE_API_URL + TSAPIRoutes.operation +'suggested_ids/' + '?key=' + keysRequired)
}

  getStaticOptions(keysRequired, includeRCM: boolean = false): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.static_options + '?key=' + keysRequired + '&includeRCM=' + includeRCM + '&is_portal=true');
  }
  companyRegistrationRange(): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.company_registration_range);
  }
  postDropDownValues (apiUrl, body) {
    return this._http.post(BASE_API_URL + apiUrl, body);
  }

  getUpdatedDropDownValues (apiUrl) {
    return this._http.get(BASE_API_URL + apiUrl);
  }

  updateGstinInParty(apiUrl,body) {
    return this._http.put(BASE_API_URL + apiUrl, body);
  }

  getCalendarDetails(month, year): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.calendar + '?month=' + month + '&year=' + year);
  }

  addCalendarNote(body): Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.calendar_note, body);
  }

  getBankDropDownList(): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.bankdropdownlist);
  }

  fetchCompanyLogo(): Observable<any>  {
    return this._http.get(BASE_API_URL + 'company/company_logo/');
}

  getOpeningBalanceStatus(): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.opening_bal_status)
  }

  getPermission(): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.settings)
  }

  uploadDigitalSignature(id,body): Observable<any>{
    return this._http.put(BASE_API_URL + TSAPIRoutes.company_add+"company_signature/"+id+"/", body);
  }
  getDigitalSignature(id): Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.company_add+"company_signature/"+id+"/");
  }
  deleteDigitalSignature(id): Observable<any>{
    return this._http.delete(BASE_API_URL + TSAPIRoutes.company_add+"company_signature/"+id+"/");
  }

  getUserDetails():Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.company_add+"user/anaytics/");
  }

  getDigitalSignatureList(): Observable<any> {
    return this._http.get(BASE_API_URL +'setting/ds/')
  }
  getTypeOfBusiness(): Observable<any> {
    return this._http.get(BASE_API_URL +'type-of-business-dropdown/')
  }


  getVehicleCatagoryType():Observable<any> {
    return this._http.get(BASE_API_URL +'vehicle/categories/')
  }

  editRequestOperations(id,body):Observable<any> {
    return this._http.post(BASE_API_URL +`screen/editrequest/remark/${id}/`,body)
  }

  getPdfHeading(key):Observable<any>{
    return this._http.get(BASE_API_URL+'company/native/?key='+key)
  }


}
