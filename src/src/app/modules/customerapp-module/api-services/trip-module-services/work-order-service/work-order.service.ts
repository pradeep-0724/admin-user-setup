import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderService {

  constructor(private _http: HttpClient) { }
   workOrderDataValue={}
 
  set workOredrcustomerData(data){
    this.workOrderDataValue = data
  }
  get workOredrcustomerData(){
    return this.workOrderDataValue 
  }
  getWorkOrderNo(): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.suggested_ids + '?key=' + 'workorder')
  }

  getWorkOrder(id): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.work_order + `${id}\\`)
  }

  saveWorkOrder(data, woId): Observable<any> {
    if (woId){
      return this._http.put(BASE_API_URL + TSAPIRoutes.work_order + `${woId}\\`, data)
    } 
    return this._http.post(BASE_API_URL + TSAPIRoutes.work_order, data)
  }

  deleteWorkOrder(id): Observable<any> {
    return this._http.delete(BASE_API_URL + TSAPIRoutes.work_order + `${id}\\`)
  }

  closeWorkOrder(id): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.work_order_close + `${id}\\`)
  }

  getWorkOrders(payload): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.work_order, {params: payload})
  }

  getWorkOrderListByCustomerId(id): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.revenue+TSAPIRoutes.workorder_dropdown_list + id+"/")
  }

  getWorkOrderFields(to_add): Observable<any> {
    return this._http.get(BASE_API_URL +TSAPIRoutes.revenue_form_field_workorder, {params:{to_add}})
  }

  getWorkOrdersView(id): Observable<any> {
    return this._http.get(BASE_API_URL+ TSAPIRoutes.work_order+"view/"+id+"/")
  }

  getWOListExcel(start_date,end_date){
    return this._http.get(BASE_API_URL + TSAPIRoutes.work_order,{params:{export:'true',start_date:start_date,end_date:end_date},responseType: 'blob'})
  }
  getWOPDF(work_order_id){
    return this._http.get(BASE_API_URL + TSAPIRoutes.work_order+TSAPIRoutes.view+work_order_id+'/',{params:{export:'true'},responseType: 'blob'})
  }

}
