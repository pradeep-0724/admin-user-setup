import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { Observable } from 'rxjs';


@Injectable({
  providedIn:'root'
})
export class IndividualInventoryService {

    constructor(
        private _http: HttpClient
    ) { }

    getHeaderBlockData(id,startDate,endDate) {
        return this._http.get(BASE_API_URL + TSAPIRoutes.report + TSAPIRoutes.individualinventory + TSAPIRoutes.header +id+ '/'  ,{params: {start_date: startDate, end_date: endDate}});
    }

    getPurchaseLogData (id,startDate,endDate) {
        return this._http.get(BASE_API_URL + TSAPIRoutes.report + TSAPIRoutes.individualinventory + TSAPIRoutes.purchaselog +id+ '/'  ,{params: {start_date: startDate, end_date: endDate}});
    }

    getIssueLogData (id,startDate,endDate) {
        return this._http.get(BASE_API_URL + TSAPIRoutes.report + TSAPIRoutes.individualinventory + TSAPIRoutes.issuelog +id+ '/'  ,{params: {start_date: startDate, end_date: endDate}});
    }

    getSpareUsageLogData (id,startDate,endDate) {
        return this._http.get(BASE_API_URL + TSAPIRoutes.report + TSAPIRoutes.individualinventory + TSAPIRoutes.spare_usage_log +id+ '/'  ,{params: {start_date: startDate, end_date: endDate}});
    }
    getInventoryList () {
        return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.inventory +  'list/');
    }

    getSpareSummaryList(){
        return this._http.get(BASE_API_URL + TSAPIRoutes.report + TSAPIRoutes.inventory +  TSAPIRoutes.spare_summary);

    }

    getTripFuelSummaryList(params:any){
      return this._http.get(BASE_API_URL + TSAPIRoutes.report + "fuel_report_trip_fuel_expense/",{params: {export:'false',start_date: params.start_date, end_date: params.end_date}});

  }

  getFuelSummaryList(params:any){
    return this._http.get(BASE_API_URL + TSAPIRoutes.report + "fuel_report_vehicle_fuel_expense/",{params: {export:'false',start_date: params.start_date, end_date: params.end_date}});

}

  exportTripFuelSummaryList(params:any):Observable<Blob>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.report + "fuel_report_trip_fuel_expense/",{params: {export:'true',start_date: params.start_date, end_date: params.end_date},
    responseType: 'blob'});

}

exportVehicleFuelSummaryList(params:any):Observable<Blob>{
  return this._http.get(BASE_API_URL + TSAPIRoutes.report + "fuel_report_vehicle_fuel_expense/",{params: {export:'true',start_date: params.start_date, end_date: params.end_date},
  responseType: 'blob'});

}


}
