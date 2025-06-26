import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class VehicleInspectionServiceService {
  constructor(private _http: HttpClient) {}

  getActiveOwnVehicles(params): Observable<any> {
    return this._http.get(BASE_API_URL + 'vehicle/list/category/',{params});
  }

  postVehicleInspection(body): Observable<any> {
    return this._http.post(BASE_API_URL + `revenue/vehicle_inspection/`,body);
  }

  putvehicleInspection(id,body): Observable<any> {
    return this._http.put(BASE_API_URL + `revenue/vehicle_inspection/${id}/`,body);
  }

  deleteVehicleInspection(id): Observable<any> {
    return this._http.delete(BASE_API_URL + `revenue/vehicle_inspection/${id}/`)
  }
  deleteVehicleInspectionInPreference(id): Observable<any> {
    return this._http.delete(BASE_API_URL + `revenue/vehicle_detail/setting/form/${id}/`)
  }

  getVehicleInspectionforms(): Observable<any> {
    return this._http.get(BASE_API_URL + `revenue/vehicle_detail/setting/form/`)
  }
  getVehicleInspectionList(params): Observable<any> {
    return this._http.get(BASE_API_URL +'revenue/vehicle_inspection/list/',{params:params})
  }

  getVehicleInspectionListExcel(params): Observable<any>{
    return this._http.get(BASE_API_URL +  'revenue/vehicle_inspection/list/',{params,responseType:'blob'})
  }

  getInspectionDetailsForEdit(id,inspectionType): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.revenue+`${inspectionType}_detail/setting/form/${id}/`)
  }

  getVehicleInspectionDetails(id): Observable<any> {
    return this._http.get(BASE_API_URL +`revenue/vehicle_inspection/${id}/`)
  }

  getVehicleInspectionView(catagory): Observable<any>{
    return this._http.get(BASE_API_URL+'revenue/vehicle_inspection/?vehicle_category='+catagory)
  }
  getVehicleInspectionDetailsForSettings(catagory): Observable<any>{
    return this._http.get(BASE_API_URL+'revenue/vehicle_detail_setting/?vehicle_category='+catagory)
  }
  deleteVehicleInspectionDetails(id): Observable<any>{
    return this._http.delete(BASE_API_URL+'revenue/vehicle_inspection/'+id+"/")
  }
  updatemandatory(body): Observable<any>{
    return this._http.post(BASE_API_URL+'revenue/vehicle_detail_setting/update/field/mandatory/',body)
  }

  getInspectionFormsList(): Observable<any> {
    return this._http.get(BASE_API_URL + 'revenue/vehicle_detail/setting/form/');
  }
  
  


}