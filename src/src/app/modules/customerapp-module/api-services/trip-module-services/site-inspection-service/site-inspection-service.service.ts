import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class SiteInspectionServiceService {
  constructor(
    private _http: HttpClient
  ) { }

  getCustomerList(): Observable<any> {
    let params = { party_type: '0', vendor_party_type: '' };
    return this._http.get(BASE_API_URL + TSAPIRoutes.party, {  params: params });
  }

  getQuotationSalesOrder(customer,vehicle_category): Observable<any> {
    return this._http.get(BASE_API_URL + `revenue/quotation/workorder/list/${customer}/?vehicle_category=${vehicle_category}`);
  }

  postSiteInspection(body): Observable<any> {
    return this._http.post(BASE_API_URL + `revenue/site_inspection/`,body);
  }

  putSiteInspection(id,body): Observable<any> {
    return this._http.put(BASE_API_URL + `revenue/site_inspection/${id}/`,body);
  }


  getSiteInspectionList(params): Observable<any> {
    return this._http.get(BASE_API_URL +'revenue/site_inspection/list/',{params:params})
  }
  
  getSiteInspectionListExcel(params): Observable<any>{
    return this._http.get(BASE_API_URL +  'revenue/site_inspection/list/',{params,responseType:'blob'})
  }
  deleteSiteInspection(id): Observable<any> {
    return this._http.delete(BASE_API_URL + `revenue/site_inspection/${id}/`)
  }

  getSiteInspectionDetails(id): Observable<any> {
    return this._http.get(BASE_API_URL +`revenue/site_inspection/${id}/`)
  }

  getApprovedSiteInspection(customer, vehicle_category): Observable<any> {
    return this._http.get(BASE_API_URL +`revenue/site_inspection/approved/`, { params: {customer:customer, vehicle_category:vehicle_category} })
  }

  getInspectionFormsList(): Observable<any> {
    return this._http.get(BASE_API_URL + 'revenue/site_detail/setting/form/');
  }

  getSiteInspectionforms(): Observable<any> {
    return this._http.get(BASE_API_URL + `revenue/site_detail/setting/form/`)
  }
  getInspectionDetailsForEdit(id,inspectionType): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.revenue+`${inspectionType}_detail/setting/form/${id}/`)
  }


  

}
