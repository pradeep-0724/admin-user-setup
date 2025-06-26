import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TSAPIRoutes, BASE_API_URL } from 'src/app/core/constants/api-urls.constants';

@Injectable()
export class AddEditQuotationService {
  constructor(
    private _http: HttpClient
  ) { }

  getCustomerList(): Observable<any> {
       let params = {party_type: '0',vendor_party_type:''} ;
    return this._http.get(BASE_API_URL + TSAPIRoutes.party,{
        params:params
    });
}

getStaticOptions(keysRequired, includeRCM: boolean = false): Observable<any> {
  return this._http.get(BASE_API_URL + TSAPIRoutes.static_options + '?key=' + keysRequired + '&includeRCM=' + includeRCM);
}

getConsignor(): Observable<any> {
  return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.consignor);
}
getConsignee(): Observable<any> {
  return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.consignee);
}

getTaxDetails():Observable<any>{
  return this._http.get(BASE_API_URL+'tax/form/options/')
}

getMaterials(): Observable<any> {
  return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.material);
}

getPartyAdressDetails(partyId: String): Observable<any> {
  return this._http.get(BASE_API_URL + TSAPIRoutes.party + partyId + '/gst/detail/');
}

postQuotation(body): Observable<any> {
  return this._http.post(BASE_API_URL +TSAPIRoutes.quotation,body);
}

putQuotation(id,body): Observable<any> {
  return this._http.put(BASE_API_URL +TSAPIRoutes.quotation+id+"/",body);
}


postQuotationDetails(id): Observable<any> {
  return this._http.get(BASE_API_URL +TSAPIRoutes.quotation+id+"/");
}

deleteQuotation(id): Observable<any> {
  return this._http.delete(BASE_API_URL +TSAPIRoutes.quotation+id+"/");
}

getQuotation(start_date,end_date): Observable<any> {
  return this._http.get(BASE_API_URL + TSAPIRoutes.quotation,{params:{start_date,end_date}});
}

postQuotationStatus(id,status): Observable<any> {
  return this._http.post(BASE_API_URL + TSAPIRoutes.quotation+"status-change/"+id+"/",{status});
}

getBankDropDownList(): Observable<any> {
  return this._http.get(BASE_API_URL + TSAPIRoutes.bankdropdownlist);
}

getPayementTermList(): Observable<any> {
  return this._http.get(BASE_API_URL +TSAPIRoutes.quotation+"payment-term/");
}

getTersmAndConditionList(): Observable<any> {
  return this._http.get(BASE_API_URL +'setting/tc/?key=quotation')
}

getDigitalSignatureList(): Observable<any> {
  return this._http.get(BASE_API_URL +'setting/ds/')
}


  
}
