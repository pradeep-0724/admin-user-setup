import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';

@Injectable()
export class TyremasterListService {

  constructor(private _http: HttpClient) { }

  deleteTyreMaster(id){
    return this._http.delete(BASE_API_URL + TSAPIRoutes.vehicle_list + TSAPIRoutes.vehicle_tyre + TSAPIRoutes.master+id+'/');

  }

  getAllTyreMasters(params){
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle_list + TSAPIRoutes.vehicle_tyre + TSAPIRoutes.master,{params:params});
  }

  getTyreMasterDetails(id){
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle_list + TSAPIRoutes.vehicle_tyre + TSAPIRoutes.master+id+'/');
  }

}
