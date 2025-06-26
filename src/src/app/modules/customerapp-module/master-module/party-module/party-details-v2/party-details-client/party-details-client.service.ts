import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class PartyDetailsClientService {
  constructor(private _http:HttpClient) { }

  getPartyInfo(id):Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.report + "party_detail/" + id + '/');
  }

  getPartyContactList(id):Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.report+TSAPIRoutes.party+ "contact_person/" + id + '/');
  }

  makePrtydefault(id):Observable<any>{
    return this._http.put(BASE_API_URL + TSAPIRoutes.report+TSAPIRoutes.party+ "contact_person/set_def/" + id + '/',{});
  }

  getClientTransactionHead(id,params):Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.report +TSAPIRoutes.client  +  "transaction/head/" + id + '/',{params});
  }

  getClientInvoice(id,params):Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.report +TSAPIRoutes.client  +  "invoices/" + id + '/',{params});
  }
  getClientSO(id,params):Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.report +TSAPIRoutes.client  +  "work_order/" + id + '/',{params});
  }

  getClientPaymentSettlement(id,params):Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.report +TSAPIRoutes.client  +  "payment_settlement/" + id + '/',{params});
  }

  getClientAdvance(id,params):Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.report +TSAPIRoutes.client  +  "advance/" + id + '/',{params});
  }

  getClientPaymentCheque(id,params):Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.report +TSAPIRoutes.client  +  "payment_cheque/" + id + '/',{params});
  }

  getClientPaymentRefund(id,params):Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.report +TSAPIRoutes.client  +  "refund/" + id + '/',{params});
  }


  getClientCreditNote(id,params):Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.report +TSAPIRoutes.client  +  "credit_note/" + id + '/',{params});
  }

  getClientDebitNote(id,params):Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.report +TSAPIRoutes.client  +  "debit_note/" + id + '/',{params});
  }

  getTripHead(id,params):Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.report+ TSAPIRoutes.client+ "trip/head/" + id + '/',{params});
  }

  getTripList(id,params):Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.report+ TSAPIRoutes.client+ "trip/summary/" + id + '/',{params});
  }

  getTripListForExport(id,params):Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.report+ TSAPIRoutes.client+ "trip/summary/" + id + '/',{params: params,responseType: 'blob'});
  }

  getTablist(id):Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.report+ TSAPIRoutes.vendor+ "tab/" + id + '/');
  }


  updatePrtyKyc(body):Observable<any>{
    return this._http.post(BASE_API_URL +TSAPIRoutes.party+ "kyc/update/",body);
  }

  getPartyCertificateList(id,params):Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.party+ "certificate/"+id + '/',{params : params});
  }

  renewCertificate(id,body):Observable<any>{
    return this._http.post(BASE_API_URL +TSAPIRoutes.party+id+"/certificate/renew/",body);
  }

  getCertificateHistory(id):Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.party+id+"/certificate/history/");
  }

  getStatementOfAccounts(id,params):Observable<any>{
    return this._http.get(BASE_API_URL +'report/client/soa/'+id+"/",{params:params});
  }

  getStatementOfAccountsExcel(id,params){
    return this._http.get(BASE_API_URL + 'report/client/soa/'+id+"/",{params,responseType: 'blob'})
  }

  getCompanyLogo():Observable<any>{
    return this._http.get(BASE_API_URL +'company/company_logo/');
  }


  getCompanyDetails():Observable<any>{
    return this._http.get(BASE_API_URL +'company/details/printview/');
  }

  getPartyDetails(id):Observable<any>{
    return this._http.get(BASE_API_URL +`party/${id}/gst/address/`);
  }






  
} 
