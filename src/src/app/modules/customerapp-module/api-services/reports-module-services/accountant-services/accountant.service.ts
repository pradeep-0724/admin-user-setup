import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { Observable } from 'rxjs';


@Injectable({
  providedIn:'root'
})
export class AccountantService {

    constructor(
        private _http: HttpClient
    ) { }

    getTrialBalanceAccounts (params?: any) {
        return this._http.get(BASE_API_URL + TSAPIRoutes.get_trial_balance,{params: params});
    }

    getBalanceSheetAccounts (params?: any) {
        return this._http.get(BASE_API_URL + TSAPIRoutes.get_balance_sheet,{params: params});
    }

    getAuditLog (params) {
        return this._http.get(BASE_API_URL + TSAPIRoutes.company_add +TSAPIRoutes.get_audit_log,{params: params});
    }

    getProfitLossAccounts (params?: any) {
        return this._http.get(BASE_API_URL + TSAPIRoutes.get_profit_loss,{params: params});
    }

    trialBalanceDownloadXlsxOrPdf(startDate,endDate,fileType) :Observable<Blob> {

          return this._http.get( BASE_API_URL +  TSAPIRoutes.get_trial_balance   + "?start_date=" + startDate + "&end_date=" + endDate+ "&export=true" + "&file_type="+fileType,{
              responseType: 'blob'
            });

  }


  downloadAuditLog(startDate,endDate,fileType) :Observable<Blob> {

    return this._http.get( BASE_API_URL +  TSAPIRoutes.company_add +TSAPIRoutes.get_audit_log    + "?start_date=" + startDate + "&end_date=" + endDate+ "&export=true" + "&file_type="+fileType,{
        responseType: 'blob'
      });

}

 profitLossDownloadXlsxOrPdf(startDate,endDate,fileType) :Observable<Blob> {

          return this._http.get( BASE_API_URL +  TSAPIRoutes.get_profit_loss   + "?start_date=" + startDate + "&end_date=" + endDate+ "&export=true" + "&file_type="+fileType,{
              responseType: 'blob'
            });

  }

  balanceSheetDownloadXlsxOrPdf(startDate,endDate,fileType) :Observable<Blob> {

    return this._http.get( BASE_API_URL +  TSAPIRoutes.get_balance_sheet   + "?start_date=" + startDate + "&end_date=" + endDate+ "&export=true" + "&file_type="+fileType,{
        responseType: 'blob'
      });

}
}
