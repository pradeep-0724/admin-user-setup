import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class OwnVehicleReportService {

  constructor(private _http:HttpClient) { }

  getVehicleReportHeader(id):Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle + "own/activeness/" + id + '/');
  }

  getVehicleInfo(id):Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle + "own/info/" + id + '/');
  }

  getVehicleSubDetails(id):Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle + "subdetail/" + id + '/');
  }


  getVehicleDocuments(id,params):Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle + "documents/" + id + '/?is_market=false',{ params : params});
  }
  getTyreChangeHistory(id,params):Observable<any>{
    return this._http.get(BASE_API_URL + 'operation/jobcard/tyre-change/history/' + id+'/',{params});
  }
  getTyreChangeHistoryFile(id,params):Observable<any>{
    return this._http.get(BASE_API_URL + 'operation/jobcard/tyre-change/history/' + id+'/',{params,responseType: 'blob'});
  }

  getVehicleSubAssets(id,params):Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle + "subasset/" + id + '/',{ params : params});
  }

  getVehicleTyreMaster(id):Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle+id+ '/tyres/info/');
  }

  getVehicleTyreDetails(id):Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle+id+ '/tyres/details/');
  }
  renewVehicleCertificates(apiText,data):Observable<any>{
    return this._http.post(BASE_API_URL + TSAPIRoutes.vehicle+apiText+'/renew/',data);
  }

  getVehicleHistoryCertificates(apiText){
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle+apiText+'/history/');

  }
  getPermitDetails(id){
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle+'permit/details/'+id+'/');

  }

} 