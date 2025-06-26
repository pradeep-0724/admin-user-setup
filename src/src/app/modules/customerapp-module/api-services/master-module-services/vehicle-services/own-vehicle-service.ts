import { BASE_API_URL, TSAPIRoutes} from '../../../../../core/constants/api-urls.constants';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OwnVehicleService {

  constructor(private _http: HttpClient) {}

  getDefaultCertificatesDocuments(vehicle_type): Observable<any>{
    return this._http.get(BASE_API_URL+'vehicle/documents/?vehicle_type='+vehicle_type+'&is_market=false');

  }

  getVehiclePermits(): Observable<any>{
    return this._http.get(BASE_API_URL+'vehicle/permit/');

  }

  getDefaultSubDetails(vehicle_type): Observable<any>{
    return this._http.get(BASE_API_URL+'vehicle/subdetail/default/?vehicle_type='+vehicle_type+'&is_market=false');

  }

  getDefaultSubAssets(vehicle_type): Observable<any>{
    return this._http.get(BASE_API_URL+'vehicle/subasset/default/?vehicle_type='+vehicle_type+'&is_market=false');

  }

  getVehicleOwnListV2(params?:any) {
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle_list +'own/' , {params : params});
  }

  getOwnVehicleListExcel(params){
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle_list +'own/',{params,responseType: 'blob'})
  }

  toggleVehicleStatus(flag: Boolean, vehicleIds: String[]): Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.vehicle_active_toggle, {
      vehicle_ids: vehicleIds,
      to_active: flag
    });
  }

  deleteVehicleDetails(vehicleId: String): Observable<any> {
    return this._http.delete(BASE_API_URL + TSAPIRoutes.vehicle_list +'own/'+vehicleId+'/');
  }

  postActivateVehicleDetails(id): Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.vehicle + 'own/activate/' + id + '/' , { vehicle_uuid: id });
  }

  addNewVehicleItem(url,body): Observable<any> {
    return this._http.post(BASE_API_URL + url,body);
  }

  updateVehicleItem(url,body): Observable<any> {
    return this._http.post(BASE_API_URL + url,body);
  }

  checkVehicleItem(url,body): Observable<any> {
    return this._http.post(BASE_API_URL + url,body);
  }

  deleteVehicleItem(url,body): Observable<any> {
    return this._http.post(BASE_API_URL + url,body);
  }

  createOwnVehicle(vehicleDetails): Observable<any> {
    return this._http.post(BASE_API_URL + 'vehicle/own/', vehicleDetails);
  }

  updateOwnVehicle(vehicleDetails,id): Observable<any> {
    return this._http.put(BASE_API_URL + 'vehicle/own/'+id+'/' , vehicleDetails);
  }

  getOwnVehicleDetailForEdit(vehicle_id: any) {
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle_list+'own/' + vehicle_id + '/')
  }


}
