import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class VehicleDetailsV2Service {

  constructor(private _http:HttpClient) { }

  getVehicleReportHeader(id):Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle + "activeness/" + id + '/');
  }

  getVehicleDetails(id):Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle + "detail/" + id + '/');
  }

  getVehicleDocuments(id):Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle + "documents/" + id + '/');
  }

  getVehicleTripHead(id,params):Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.report+ TSAPIRoutes.vehicle+TSAPIRoutes.trip + "head/" + id + '/',{params});
  }

  getVehicleTripList(id,params):Observable<any>{909008080
    return this._http.get(BASE_API_URL +TSAPIRoutes.report+ TSAPIRoutes.vehicle+TSAPIRoutes.trip + "list/" + id + '/',{params});
  }

  getVehicleTripListExport(id,params):Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.report+ TSAPIRoutes.vehicle+TSAPIRoutes.trip + "list/" + id + '/',{params: params,responseType: 'blob'});
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

  getJobCardSummaryExport(id,params):Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.report+ TSAPIRoutes.vehicle+ "jobcards/" + id + '/',{params: params,responseType: 'blob'});
  }

  getVehicleService(id,params):Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.report+ TSAPIRoutes.vehicle+ "servicesummary/" + id + '/',{params});
  }

  getVehicleServiceExport(id,params):Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.report+ TSAPIRoutes.vehicle+ "servicesummary/" + id + '/',{params: params,responseType: 'blob'});
  }

  getVehicleFuelHeader(id,params):Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.report+ TSAPIRoutes.vehicle+ "fuel/head/" + id + '/',{params});
  }

  getVehicleFuelInTableData(id,params):Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.report+ TSAPIRoutes.vehicle+ "fuelin/" + id + '/',{params});
  }
  getVehicleFuelOutTableData(id,params):Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.report+ TSAPIRoutes.vehicle+ "fuelout/" + id + '/',{params});
  }
  postEMiPaidData(id,data):Observable<any>{
    return this._http.post(BASE_API_URL + TSAPIRoutes.vehicle+ "emi/" + id + '/',data);
  }
  // all the API call Will happen From here for Vehicle Details
} 
