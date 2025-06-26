import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_API_URL, BASE_API_URL_V2, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { Observable } from 'rxjs';

@Injectable( {
  providedIn: 'root'
})
export class EmployeeService {
  addTimeline = {
    isInformationSaved: false,
    isAddressSaved: false,
    isDocumentsSaved: false,
    isBankSaved:false
  };
    constructor(
        private _http: HttpClient,
    ) { }

    postEmployeeInformation(employeeInformation) {
        return this._http.post(BASE_API_URL + TSAPIRoutes.employee_information_add, employeeInformation);
    }

    postDocuments(document, employee_id) {
        return this._http.post(BASE_API_URL + TSAPIRoutes.employee_list + employee_id + '/' + 'documents/', document);
    }

    postAddress(address, employee_id) {
        return this._http.post(BASE_API_URL + TSAPIRoutes.employee_list + employee_id + '/' + 'address/', address);
    }

    postBanks(bank, employee_id) {
        return this._http.post(BASE_API_URL + TSAPIRoutes.employee_list + employee_id + '/' + 'bank/', bank);
    }

    getEmployeeList(params?:any): Observable<any> {
            params = { is_archive: params }
        return this._http.get(BASE_API_URL + TSAPIRoutes.employee_list, {
            params: params
        });
    }

    getNoDriverEmployeeList(): Observable<any> {
      const params = { is_archive: false, no_drivers: true }
      return this._http.get(BASE_API_URL + TSAPIRoutes.employee_list, {
          params: params
      });
    }

    getEmployeesListV2(params=null): Observable<any> {
    if (params)
        return this._http.get(BASE_API_URL_V2 + TSAPIRoutes.employee_list, {params: params});
    return this._http.get(BASE_API_URL_V2 + TSAPIRoutes.employee_list);
    }

    getDriverList(): Observable<any> {
        return this._http.get(BASE_API_URL_V2 +TSAPIRoutes.driver_list);
    }

    getEmployeeDetails(employeeId: any, params?: any): Observable<any> {
        return this._http.get(BASE_API_URL + TSAPIRoutes.employee_list + employeeId + '/', {params: params});
    }

    getVehicleAssigend() {
        return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle_active_list);
    }

    getEmployeeListExcel(params) {
      return this._http.get(BASE_API_URL + TSAPIRoutes.employee_list+TSAPIRoutes.list,{params,responseType: 'blob'});
  }

  getDriverLdegerExcel(id,startDate,endDate){
    return this._http.get(BASE_API_URL + TSAPIRoutes.report+'driver_ledger/'+id+"/",{params:{start_date:startDate,end_date:endDate,export:'true'},responseType: 'blob'});
  }

    deleteEmployee (employee_id) {
        return this._http.delete(BASE_API_URL + TSAPIRoutes.employee_list + employee_id + '/details/');
    }

    postArchiveLastWorkingDate(data,id){
        return this._http.post(BASE_API_URL + TSAPIRoutes.employee_list + id + '/archive/',data)
    }

    getDriverLedger(driverId: any, params?: any): Observable<any> {
      return this._http.get(BASE_API_URL + TSAPIRoutes.report+"driver_ledger/"+driverId + '/', {params: params});
  }

  getEmployeeListonScroll(listQueryParams) {        
    return this._http.get(BASE_API_URL + TSAPIRoutes.employee_list+TSAPIRoutes.list,{params:listQueryParams});
  }
  // ///////////

  getVehicleSpecsList() {        
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle+'own/specs/');
  }

  checkEmployeeEligiblity(data): Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.employee_list+"eligibility/",data);
}
}