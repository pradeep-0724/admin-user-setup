import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EmployeeDetailsService {
    constructor(
        private _http: HttpClient,
    ) { }

    getEmployeeInfo(id): Observable<any> {
        return this._http.get(BASE_API_URL + 'employee/' + id + '/info/');
    }

    getEmployeeBank(id): Observable<any> {
        return this._http.get(BASE_API_URL + 'employee/' + id + '/bank/');
    }

    getEmployeeDocument(id,params): Observable<any> {
        return this._http.get(BASE_API_URL + 'employee/' + id + '/documents/',{params : params});
    }

    getEmployeeTripHead(id, params): Observable<any> {
        return this._http.get(BASE_API_URL + 'report/emp/trip/head/' + id + "/", { params: params });
    }

    getEmployeeTripList(id, params): Observable<any> {
        return this._http.get(BASE_API_URL + 'report/emp/trip/summary/' + id + "/", { params: params });
    }
    getEmployeeTripListExport(id, params): Observable<any> {
        return this._http.get(BASE_API_URL + 'report/emp/trip/summary/' + id + "/", { params: params ,responseType: 'blob'});
    }

    // getEmployeeLedgerList(id,params):Observable<any> {
    //     return this._http.get(BASE_API_URL +TSAPIRoutes.report+ '/emp/transaction/list/'+id+"/",{params:params});
    // }

    getEmployeeSalaryList(id, params): Observable<any> {
        return this._http.get(BASE_API_URL + TSAPIRoutes.report + 'emp/transaction/list/' + id + "/", { params: params });
    }

    getEmployeeSalaryExport(id, params): Observable<any> {
        return this._http.get(BASE_API_URL + TSAPIRoutes.report + 'emp/transaction/list/' + id + "/", { params: params ,responseType: 'blob'});
    }

    postDiverLedger(data): Observable<any> {
        return this._http.post(BASE_API_URL + TSAPIRoutes.report + 'driver_ledger/create/', data)
    }
    deleteDiverLedger(id): Observable<any> {
        return this._http.delete(BASE_API_URL + TSAPIRoutes.report + 'driver_ledger/'+id+'/delete/')
    }

    getEmployeeLedgerList(driverId: any, params?: any): Observable<any> {
        return this._http.get(BASE_API_URL + TSAPIRoutes.report + "driver_ledger/" + driverId + '/', { params: params });
    }

    getEmployeeLedgerExport(driverId: any, params?: any): Observable<any> {
        return this._http.get(BASE_API_URL + TSAPIRoutes.report + "driver_ledger/" + driverId + '/', { params: params ,responseType: 'blob' });
    }

    getEmployeeHistoryCertificates(apiText){
        return this._http.get(BASE_API_URL + TSAPIRoutes.employee_list+apiText+'/history/');
    
      }


}