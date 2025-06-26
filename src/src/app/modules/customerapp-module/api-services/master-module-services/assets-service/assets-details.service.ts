import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssetsDetailsService {

  constructor(
    private _http: HttpClient
  ) { }

  getAssetsView(id:string): Observable<any> {
    return this._http.get(BASE_API_URL + 'asset/' + TSAPIRoutes.view + id+'/');
  }
  getAssetsSubDetails(id:string): Observable<any> {
    return this._http.get(BASE_API_URL + 'asset/subdetail/' + id+'/');
  }
  getAssetsDocuments(id:string,params): Observable<any> {
    return this._http.get(BASE_API_URL +'asset/'+TSAPIRoutes.vehicle_documents  + id+'/',{ params : params});
  }
  getAssetsSubAssets(id:string,params): Observable<any> {
    return this._http.get(BASE_API_URL +'asset/'+ id+'/subasset/',{ params : params});
  }
  getAssetsTyreMaster(id):Observable<any>{
    return this._http.get(BASE_API_URL + 'asset/'+id+ '/tyres/info/');
  }
  getAssetsTyreDetails(id):Observable<any>{
    return this._http.get(BASE_API_URL + 'asset/'+id+ '/tyres/details/');
  }

  renewAssetCertificates(apiText,data):Observable<any>{
    return this._http.post(BASE_API_URL +TSAPIRoutes.vehicle+apiText+'/renew/',data);
  }
  renewPermits(id,data):Observable<any>{
    return this._http.put(BASE_API_URL +'permit/renew/'+id+'/',data);
  }
  getAssetCertificatesHistory(apiText){
    return this._http.get(BASE_API_URL + 'asset/'+apiText+'/history/');
  }

  permitHistoryList(id):Observable<any>{
    return this._http.get(BASE_API_URL +'permit/history/'+id+'/');
  }

  getPermitDetails(id,params){
    return this._http.get(BASE_API_URL + 'asset/permit/details/'+id+'/',{params : params});

  }
  getAssignedAssetsInJobs(id,params): Observable<any>{
    return this._http.get(BASE_API_URL + 'report/asset/trip/list/'+ id + '/',{params : params})
  }
  getServiceJobCard(id,params):Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.report+ TSAPIRoutes.vehicle+ "jobcard/head/" + id + '/',{params});
  }

  getServiceJobDonut(id,params):Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.report+ TSAPIRoutes.vehicle+ "servicesummarycount/" + id + '/',{params});
  }

  getJobCardSummary(id,params):Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.report+ TSAPIRoutes.vehicle+ "jobcards/" + id + '/',{params});
  }

  getAssetService(id,params):Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.report+ TSAPIRoutes.vehicle+ "servicesummary/" + id + '/',{params});
  }

  getVehicleTripHead(id,params):Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.report+ TSAPIRoutes.vehicle+TSAPIRoutes.trip + "head/" + id + '/',{params});
  }

  getAssetJobList(id,params):Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.report+ TSAPIRoutes.vehicle+TSAPIRoutes.trip + "list/" + id + '/',{params});
  }




  
}
