import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderV2Service {

  constructor(private _http: HttpClient) { }
  
  postWorkOrder(body): Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.revenue+ TSAPIRoutes.workorder ,body)
  }

  putWorkOrder(id,body): Observable<any> {
    return this._http.put(BASE_API_URL + TSAPIRoutes.revenue+ TSAPIRoutes.workorder +id+'/',body)
  }

  getWorkOrderDetailsById(id): Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.revenue +TSAPIRoutes.workorder+'detail/'+id+"/");
  }

  getWorkOrderNo(): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.suggested_ids + '?key=' + 'workorder')
  }

  getQuotationsList(id): Observable<any> {
    return this._http.get(BASE_API_URL +TSAPIRoutes.quotation+ 'approved/list/'+id+'/')
  }

  getWorkOrderList(params): Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.revenue +TSAPIRoutes.workorder+TSAPIRoutes.list,{params:params});
  }

  getWorkOrderDetails(id): Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.revenue +TSAPIRoutes.workorder+id+"/");
  }


  getWorkOrderTripInfo(id,params): Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.revenue +TSAPIRoutes.workorder+"others/trips/"+id+"/",{params:params});
  }


  putWorkOrderFields(id,type,body): Observable<any>{
    return this._http.put(BASE_API_URL +TSAPIRoutes.revenue +TSAPIRoutes.workorder+type+"/"+id+"/",body);
  }

  getQuotationWorkorderDetails(id): Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.quotation +TSAPIRoutes.workorder+id+"/");
  }

 createMultipleTrips(body): Observable<any>{
    return this._http.post(BASE_API_URL +TSAPIRoutes.revenue +TSAPIRoutes.workorder + "trips/add/",body);
  }

  downloadWOList(params): Observable<any> {
    return this._http.get(BASE_API_URL +TSAPIRoutes.revenue +TSAPIRoutes.workorder +TSAPIRoutes.list,{params:params,responseType: "blob"
  });
  }

  getValidationDetails(): Observable<any> {
    return this._http.get(BASE_API_URL +'screen/validation/'+'workorder/');
  }

  getApprovalLevelDetails(latestBy,category): Observable<any> {
    return this._http.get(BASE_API_URL +'screen/approval/'+'workorder/', { params: {latest_by:latestBy,category:category}});
  }

  resendForAproval(id,data): Observable<any> {
    return this._http.post(BASE_API_URL+TSAPIRoutes.revenue +'workorder/approval/'+id+'/',data);
  }

  voidQuotation(id): Observable<any> {
    return this._http.post(BASE_API_URL+TSAPIRoutes.revenue +'workorder/void/'+id+'/',{});
  }

  quotationApprovedorRejected(id,data): Observable<any> {
    return this._http.post(BASE_API_URL +TSAPIRoutes.revenue+'workorder/approve/'+id+'/',data);
  }

  getWorkOrderJobInfo(id,params): Observable<any> {
    return this._http.get(BASE_API_URL +TSAPIRoutes.revenue +TSAPIRoutes.workorder+id+'/trip/list/',{params:params});
  }
  getSOCargoJobInfo(id,params): Observable<any> {
    return this._http.get(BASE_API_URL +TSAPIRoutes.revenue +TSAPIRoutes.workorder+'cargo/trips/'+id+'/',{params:params});
  }
  getSOCargoMaterialInfo(id): Observable<any> {
    return this._http.get(BASE_API_URL +TSAPIRoutes.revenue +TSAPIRoutes.workorder+'cargo/material/'+id+'/');
  }

  closeWorkOrder(id): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.work_order_close + `${id}\\`)
  }

  getWorkOrderUnitsStatus(id): Observable<any> {
    return this._http.get(BASE_API_URL+TSAPIRoutes.revenue +'workorder/editable/'+id+'/')
  }

  getWorkorderContainerTableSettings(id): Observable<any> {
    return this._http.get(BASE_API_URL+TSAPIRoutes.revenue +`workorder/${id}/container/setting/`)
  }

  getWorkorderContainerData(id,params={}): Observable<any> {
    return this._http.get(BASE_API_URL+TSAPIRoutes.revenue +`workorder/container/${id}/`,{params:params})
  }

  putContainerDetails(id,body): Observable<any> {
    return this._http.put(BASE_API_URL+TSAPIRoutes.revenue +`workorder/container/${id}/`,body)
  }

  convertWoToJob(body): Observable<any> {
    return this._http.post(BASE_API_URL+TSAPIRoutes.revenue +`workorder/container/trips/add/`,body)
  }

  containerPaths(id,movement_sow): Observable<any> {
    return this._http.get(BASE_API_URL+TSAPIRoutes.revenue +`workorder/${id}/container/path/?movement_sow=${movement_sow}`)
  }

  getWorkOrderTripInfoContainers(id,params): Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.revenue +TSAPIRoutes.workorder+"cont/trips/"+id+"/",{params:params});
  }

  getWorkOrderFrightDetails(id): Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.revenue +TSAPIRoutes.workorder+'container/freight/'+id+"/");
  }

  uploadSODocument(id,body): Observable<any>{
    return this._http.put(BASE_API_URL+'revenue/workorder/document_upload/'+id+'/',body)
  }

  getUploadedSODocuments(id): Observable<any>{
    return this._http.get(BASE_API_URL+'revenue/workorder/document_upload/'+id+'/')
  }

  deleteUploadedSODocuments(id): Observable<any>{
    return this._http.delete(BASE_API_URL+'revenue/workorder/document_upload/'+id+'/')
  }

  getUniqueTokenVerification(token): Observable<any>{
    let params = {
      token : token
    }
    return this._http.get(BASE_API_URL+TSAPIRoutes.revenue+'trip_new/token/',{params : params})
  }

  getPointOfContactsList(id): Observable<any>{
    return this._http.get(BASE_API_URL+'report/party/poc/'+id+'/')
  }
  
  postPointOfContactsList(id,body): Observable<any>{
    return this._http.post(BASE_API_URL+'report/party/poc/'+id+'/',body)
  }

}
