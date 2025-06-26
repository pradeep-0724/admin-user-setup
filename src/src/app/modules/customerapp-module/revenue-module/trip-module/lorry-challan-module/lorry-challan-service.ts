import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { TSAPIRoutes, BASE_API_URL } from 'src/app/core/constants/api-urls.constants';
import { ValidationConstants } from 'src/app/core/constants/constant';

@Injectable({
  providedIn: 'root'
})
export class LorryChallanService {

  accountType = new ValidationConstants().accountType.join(',');
  apiUrl: string;

  constructor(
    private _http: HttpClient
  ) { }


  addDriver(data):Observable<any>{
    return this._http.post(BASE_API_URL + TSAPIRoutes.lorrychallan_driver, data);
  }

  addOwner(data):Observable<any>{
    return this._http.post(BASE_API_URL + TSAPIRoutes.lorrychallan_owner, data);
  }

  getDrivers():Observable<any>{
    return this._http.get(BASE_API_URL +  TSAPIRoutes.lorrychallan_driver);
  }

  getOwners():Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.lorrychallan_owner);
  }

  addDriverCustomField(data):Observable<any>{
    return this._http.post(BASE_API_URL + TSAPIRoutes.lorrychallan_driver_customfield, data);
  }

  getDriverCustomField():Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.lorrychallan_driver_customfield);
  }

  addOwnerCustomField(data):Observable<any>{
    return this._http.post(BASE_API_URL + TSAPIRoutes.lorrychallan_owner_customfield, data);
  }

  getOwnerCustomField():Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.lorrychallan_owner_customfield);
  }

  addOtherCustomField(data):Observable<any>{
    return this._http.post(BASE_API_URL + TSAPIRoutes.lorrychallan_other_customfield, data);
  }

  getOtherCustomField():Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.lorrychallan_other_customfield);
  }

  getVehicleCustomField():Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.lorrychallan_vehicle_customfield);
  }

  addVehicleCustomField(data):Observable<any>{
    return this._http.post(BASE_API_URL + TSAPIRoutes.lorrychallan_vehicle_customfield, data);
  }

  deleteVehicleCustomField(customFieldId):Observable<any>{
    return this._http.delete(BASE_API_URL + TSAPIRoutes.lorrychallan_vehicle_customfield + `${customFieldId}/`);
  }

  deleteOwnerCustomField(customFieldId):Observable<any>{
    return this._http.delete(BASE_API_URL + TSAPIRoutes.lorrychallan_owner_customfield + `${customFieldId}/`);
  }

  deleteDriverCustomField(customFieldId):Observable<any>{
    return this._http.delete(BASE_API_URL + TSAPIRoutes.lorrychallan_driver_customfield + `${customFieldId}/`);
  }

  deleteOtherCustomField(customFieldId):Observable<any>{
    return this._http.delete(BASE_API_URL + TSAPIRoutes.lorrychallan_other_customfield + `${customFieldId}/`);
  }

  editVehicleCustomField(customFieldId, data):Observable<any>{
    return this._http.put(BASE_API_URL + TSAPIRoutes.lorrychallan_vehicle_customfield + `${customFieldId}/`, data);
  }

  editOwnerCustomField(customFieldId, data):Observable<any>{
    return this._http.put(BASE_API_URL + TSAPIRoutes.lorrychallan_owner_customfield + `${customFieldId}/`, data);
  }

  editDriverCustomField(customFieldId, data):Observable<any>{
    return this._http.put(BASE_API_URL + TSAPIRoutes.lorrychallan_driver_customfield + `${customFieldId}/`, data);
  }

  editOtherCustomField(customFieldId, data):Observable<any>{
    return this._http.put(BASE_API_URL + TSAPIRoutes.lorrychallan_other_customfield + `${customFieldId}/`, data);
  }

  getVehiclePopulateDetails(veihlceId, driverId: string = ""):Observable<any>{
    if (driverId) {
      return this._http.get(BASE_API_URL + TSAPIRoutes.lorrychallan_vehicle_populate + `${veihlceId}/`, {params: {driver: driverId}});
    }
    return this._http.get(BASE_API_URL + TSAPIRoutes.lorrychallan_vehicle_populate + `${veihlceId}/`);
  }

  getLorryChallanConsignmentNoteOptions() {
    return this._http.get(BASE_API_URL + TSAPIRoutes.lorrychallan_consignment_options)
  }

  getPrintViewLorryChallan(id):Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.lorrychallan_printview + id + '/')
  }
}
