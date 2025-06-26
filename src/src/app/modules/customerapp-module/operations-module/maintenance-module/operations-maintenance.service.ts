import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {

  constructor(
    private _http: HttpClient
  ) { }


  getVehicleList(): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle + TSAPIRoutes.company_add + "list/");
  }

  getVehicleAndAssetList(): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle + 'asset/list/');
  }



  postJobCard(body): Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.jobcard,body);
  }

  putJobCard(id,body): Observable<any> {
    return this._http.put(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.jobcard+id+'/',body);
  }

  postJobCardStart(id,body): Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.jobcard+'start/'+id+'/',body);
  }

  getJobCardServiceHistory(id,vehicleId): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.jobcard+'service/history/'+id+'/'+vehicleId+"/");
  }

  getJobCardServicesList(id): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.jobcard+'services/'+id+'/');
  }

  getJobCardLiveStatus(): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.jobcard+'status/');
  }

  getJobCardHead(id): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.jobcard +'head/'+id+'/');
  }


  getJobCardDetail(id): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.jobcard+id+'/');
  }

  getJobCard(params): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.jobcard+TSAPIRoutes.list,{params:params});
  }
  getJobCardDetails(id): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.jobcard+ `service/list/${id}/`);
  }

  getServiceTypeList(vehicleId): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.operation +TSAPIRoutes.jobcard+'service-type/'+vehicleId+"/");
  }

  getServiceTypeListForAdd(): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.operation +TSAPIRoutes.jobcard+'service-type/');
  }

  getInventorySpareList(): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.jobcard+'spare/list/');
  }

  getInventoryTyreList(): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.operation + "inventory/tyres/")
  }

  postNewServiceType(body): Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.jobcard+ 'service-type/',body);
  }

  postJobCardNewService(body): Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.jobcard+ `service/`,body);
  }

  getJobCardNewService(id): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.operation +TSAPIRoutes.jobcard+ `service/${id}/`);
  }


  postJobCardNewInventory(body): Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.jobcard+ `inventory/`,body);
  }

  putJobCardNewInventory(id,body): Observable<any> {
    return this._http.put(BASE_API_URL + TSAPIRoutes.operation +TSAPIRoutes.jobcard+ `inventory/${id}/`,body);
  }

  getJobCardNewInventory(id): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.operation +TSAPIRoutes.jobcard+ `inventory/${id}/`);
  }

  putJobCardNewService(id,body): Observable<any> {
    return this._http.put(BASE_API_URL + TSAPIRoutes.operation +TSAPIRoutes.jobcard+ `service/${id}/`,body);
  }

  validatePosition(date, vehicle, position){
    return this._http.get( BASE_API_URL + TSAPIRoutes.validate_vehicle_position, {params: {date: date, vehicle: vehicle, position: position}})
  }

  postUpload(body): Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.jobcard+ `document/`,body);
  }

  deleteJobCardService(id): Observable<any> {
    return this._http.delete(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.jobcard+ `service/${id}/`);
  }

  deleteJobCardInventory(id): Observable<any> {
    return this._http.delete(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.jobcard+ `inventory/${id}/`);
  }

  deleteJobCard(id): Observable<any> {
    return this._http.delete(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.jobcard+`${id}/`);
  }

  closeJobCard(id,body): Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.jobcard+ `end/${id}/`,body);
  }


  getUniqueNumber(tyreno, tyreId: string = ""): Observable<any>{
		if (!tyreId) {
			return this._http.get(BASE_API_URL +TSAPIRoutes.operation + TSAPIRoutes.vehicle_tyers, {params:{tyreno: tyreno}})
		}
		return this._http.get(BASE_API_URL +TSAPIRoutes.operation + TSAPIRoutes.vehicle_tyers, {params:{tyreno: tyreno, tyreid: tyreId}})
	   }

     getPrefixJobCard(): Observable<any> {
      return this._http.get(BASE_API_URL +  TSAPIRoutes.operation+'suggested_ids/?key=job_card');
    }


}
