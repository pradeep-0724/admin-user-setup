import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';


@Injectable({
  providedIn:'root'
})
export class OverallModuleService {

    constructor(
        private _http: HttpClient
    ) { }
    getOwnVehicleList() {
      return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle + 'company/' + TSAPIRoutes.list );
    }

    getVehcileDocuments(id) {
      return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle + 'documents/' +id+'/' );
    }


    getTopBlockInventoryDetails() {

        return this._http.get(BASE_API_URL + TSAPIRoutes.report + TSAPIRoutes.inventory + TSAPIRoutes.overall + TSAPIRoutes.header + TSAPIRoutes.stock);
    }

    getTopBlockEstimatedDetails(startDate,endDate) {
        return this._http.get(BASE_API_URL + TSAPIRoutes.report + TSAPIRoutes.inventory + TSAPIRoutes.overall + TSAPIRoutes.header + TSAPIRoutes.estimate + '?start_date='+startDate+'&end_date='+endDate);

    }

    getInventoryAvailableData(startDate,endDate){
        return this._http.get(BASE_API_URL + TSAPIRoutes.report + TSAPIRoutes.inventory + TSAPIRoutes.overall + TSAPIRoutes.available  + '?start_date='+startDate+'&end_date='+endDate);

    }

    getInventoryMaintenanceData(startDate,endDate){
        return this._http.get(BASE_API_URL + TSAPIRoutes.report + TSAPIRoutes.inventory + TSAPIRoutes.overall + TSAPIRoutes.maintenance  + '?start_date='+startDate+'&end_date='+endDate);

    }

    getItemsBelowCriticalLimitData(startDate,endDate){
        return this._http.get(BASE_API_URL + TSAPIRoutes.report + TSAPIRoutes.inventory + TSAPIRoutes.overall + TSAPIRoutes.items_critical  + '?start_date='+startDate+'&end_date='+endDate);

    }

    getInventoryUtilisationData(startDate,endDate){
        return this._http.get(BASE_API_URL + TSAPIRoutes.report + TSAPIRoutes.inventory + TSAPIRoutes.overall + TSAPIRoutes.items_utilization  + '?start_date='+startDate+'&end_date='+endDate);

    }
 
 
  getAllVehcleDocsReport(queryParams){
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle +'all/documents/',{params:queryParams});
  }

  postAddVehicleDoc(id,data){
    return this._http.post(BASE_API_URL + TSAPIRoutes.vehicle+'renew_update/documents/'+id+'/',data);
  }

  postAddNewVehicleDoc(id,data){
    return this._http.post(BASE_API_URL + TSAPIRoutes.vehicle+'document/name/add/'+id+'/',data);
  }

  
}

