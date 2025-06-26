import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn:'root'
})
export class TyreMasterAddEditService {

  constructor(private _http: HttpClient) { }

  getTyreMasterDetails(id):Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle_list + TSAPIRoutes.vehicle_tyre + TSAPIRoutes.master+id+'/');
  }

  postTyreMasters(data):Observable<any>{
    return this._http.post(BASE_API_URL + TSAPIRoutes.vehicle_list + TSAPIRoutes.vehicle_tyre + TSAPIRoutes.master,data);
  }

  updateTyreMasters(id,data):Observable<any>{
    return this._http.put(BASE_API_URL + TSAPIRoutes.vehicle_list + TSAPIRoutes.vehicle_tyre + TSAPIRoutes.master+id+'/',data);
  }

  getTyreBrand():Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle_list + TSAPIRoutes.vehicle_tyre+'brand/');

  }

  getTyreModel(brand):Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle_list + TSAPIRoutes.vehicle_tyre+'brand/' +brand+'/model/');

  }
  getTyrePlacementOnMakeAndModel(make,model):Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle_list + TSAPIRoutes.vehicle_tyre+'placements/'+make+'/'+model+'/');

  }
}
