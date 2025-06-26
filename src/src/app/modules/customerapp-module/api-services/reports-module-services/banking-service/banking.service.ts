import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { Observable } from 'rxjs';


@Injectable({
  providedIn:'root'
})
export class BankingService {

    constructor(
        private _http: HttpClient
    ) { }

    getBankActivities(params): Observable<any> {
      return this._http.get(BASE_API_URL + TSAPIRoutes.get_bank_activities+'list/',{params : params});
    }

    getBankActivityById(bank_activity_id): Observable<any> {
      return this._http.get(BASE_API_URL + TSAPIRoutes.get_bank_activities + bank_activity_id + '/');
    }

    createNewBankActivity(bankActivityRequest): Observable<any> {
      return this._http.post(BASE_API_URL + TSAPIRoutes.get_bank_activities, bankActivityRequest);
    }

    updateBankActivity(bankActivityRequest, bank_activity_id): Observable<any> {
      return this._http.put(BASE_API_URL + TSAPIRoutes.get_bank_activities  + bank_activity_id + '/', bankActivityRequest);
    }


    deleteBankActivityById(bank_activity_id): Observable<any> {
      return this._http.delete(BASE_API_URL + TSAPIRoutes.get_bank_activities + bank_activity_id + '/');
    }
}
