import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_API_URL } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class SiteInspectionSettingsService {

  constructor( private _http: HttpClient) { }


 addStiteInspection(body): Observable<any>{
  return this._http.post(BASE_API_URL+'revenue/site_detail_setting/',body)
}

editStiteInspection(id,body): Observable<any>{
  return this._http.put(BASE_API_URL+'revenue/site_detail_setting/' +id+"/",body)
}

getStiteInspectionView(catagory): Observable<any>{
  return this._http.get(BASE_API_URL+'revenue/site_detail_setting/?vehicle_category='+catagory)
}

getStiteInspectionDetails(id): Observable<any>{
  return this._http.get(BASE_API_URL+'revenue/site_detail_setting/'+id+"/")
}

deleteStiteInspectionDetails(id): Observable<any>{
  return this._http.delete(BASE_API_URL+'revenue/site_detail_setting/'+id+"/")
}

updateOption(body): Observable<any>{
  return this._http.post(BASE_API_URL+'revenue/site_detail_setting/update/option/',body)
}

updatemandatory(body): Observable<any>{
  return this._http.post(BASE_API_URL+'revenue/site_detail_setting/update/field/mandatory/',body)
}

deleteInspectionInspectionForm(id){
  return this._http.delete(BASE_API_URL+'revenue/site_detail_setting/update/field/mandatory/',id,)
}


getInspectionFormsList(): Observable<any> {
  return this._http.get(BASE_API_URL + 'revenue/site_detail/setting/form/');
}

deleteSiteInspectionInPreference(id): Observable<any> {
  return this._http.delete(BASE_API_URL + `revenue/site_detail/setting/form/${id}/`)
}

getSiteInspectionforms(): Observable<any> {
  return this._http.get(BASE_API_URL + `revenue/site_detail/setting/form/`)
}
getSiteInspectionDetailsForEdit(id): Observable<any> {
  return this._http.get(BASE_API_URL +`revenue/site_detail/setting/form/${id}/`)
}





}
