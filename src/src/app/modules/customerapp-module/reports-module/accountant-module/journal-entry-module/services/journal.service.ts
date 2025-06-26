import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { Observable } from 'rxjs';


@Injectable({
  providedIn:'root'
})
export class JournalService {

    accountType = new ValidationConstants().accountType.join(',');

    constructor(
        private _http: HttpClient
    ) { }

    getAccountList (params?: any) {
      if (!params) {
        params = this.accountType;
      }
      return this._http.get(BASE_API_URL + TSAPIRoutes.chart_of_account, {params: {q: params}});
    }

    getAllAccountList (params?: any) {
        return this._http.get(BASE_API_URL + TSAPIRoutes.chart_of_account);
      }

    postManualJournalEntry (data: any) {
        return this._http.post(BASE_API_URL + TSAPIRoutes.manual_journal_entry , data)
    }

    editManualJournalEntry (data: any, journal_id: string) {
        return this._http.put(BASE_API_URL + TSAPIRoutes.manual_journal_entry + journal_id + '/', data)
    }

    getManualJournalEntryDetail (journal_id: string) {
        return this._http.get(BASE_API_URL + TSAPIRoutes.manual_journal_entry + journal_id + '/');
    }

    getManualJournalEntryList () {
        return this._http.get(BASE_API_URL + TSAPIRoutes.manual_journal_entry)
    }

    getJournalEntryList (params) {
        return this._http.get(BASE_API_URL + TSAPIRoutes.journal_entry,{ params: params})
    }

    postFilterData(data){
      return this._http.get(BASE_API_URL + TSAPIRoutes.invoice,{params: {filter_set: JSON.stringify(data) }})

    }
    getAllFilterOptions(startEndDate){
      return this._http.get(BASE_API_URL + TSAPIRoutes.journal_entry+'filter_set/',{ params: { start_date:startEndDate['start_date'],end_date:startEndDate['end_date']}})
   }

    downloadXlsxOrPdf(startDate,endDate,search,fileType,filterSet) :Observable<Blob> {
      if(filterSet&&search){
        return this._http.get( BASE_API_URL +  TSAPIRoutes.journal_entry  + "?start_date=" + startDate + "&end_date=" + endDate+ "&search_query="+search+ "&export=true" + "&file_type="+fileType+"&filter_set="+JSON.stringify(filterSet),{
          responseType: 'blob'
        });
      }
      if(filterSet){
        return this._http.get( BASE_API_URL +  TSAPIRoutes.journal_entry  + "?start_date=" + startDate + "&end_date=" + endDate+ "&export=true" + "&file_type="+fileType+"&filter_set="+JSON.stringify(filterSet),{
          responseType: 'blob'
        });
      }
        if(search){
            return this._http.get( BASE_API_URL +  TSAPIRoutes.journal_entry  + "?start_date=" + startDate + "&end_date=" + endDate+ "&search_query="+search+ "&export=true" + "&file_type="+fileType,{
                responseType: 'blob'
              });
        }
    else{
        return this._http.get( BASE_API_URL +  TSAPIRoutes.journal_entry  + "?start_date=" + startDate + "&end_date=" + endDate+ "&export=true" + "&file_type="+fileType,{
            responseType: 'blob'
          });


    }
  }
  downloadJournalEntry(params){
    return this._http.get( BASE_API_URL +  TSAPIRoutes.journal_entry,{
      responseType: 'blob',params : params
    });
  }

}
