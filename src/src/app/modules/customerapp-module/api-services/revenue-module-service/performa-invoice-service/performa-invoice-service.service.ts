import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class PerformaInvoiceServiceService {
  constructor(
    private _http: HttpClient
) { }

getInvoiceList (params) {
    return this._http.get( BASE_API_URL + TSAPIRoutes.performa+TSAPIRoutes.list,{ params});
}

getInvoiceTypesCount(start_date,end_date):Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.performa+ TSAPIRoutes.status_count,{params:{start_date,end_date}});
}

saveInvoice(invoiceDetails): Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.performa, invoiceDetails);
}

getInvoiceDetail (invoice_id: string) {
    return this._http.get(BASE_API_URL + TSAPIRoutes.performa  + invoice_id + '/');
}

getInvoiceExport (params) :Observable<Blob>{
  return this._http.get(BASE_API_URL + TSAPIRoutes.performa + TSAPIRoutes.list, {params:params,responseType: 'blob'});
}

getInvoicePrintView (invoice_id: string) {
    return this._http.get(BASE_API_URL + TSAPIRoutes.performa  + invoice_id + '/printview/');
}

editInvoiceNote (data: any, invoice_id: string) {
    return this._http.put(BASE_API_URL + TSAPIRoutes.performa + invoice_id + '/', data);
}

postInvoiceAsDraft (data: any) {
    return this._http.post(BASE_API_URL + TSAPIRoutes.performa_invoice_draft, data);
}

putInvoiceAsDraft (data: any, invoice_id) {
    return this._http.put(BASE_API_URL + TSAPIRoutes.performa + invoice_id + '/draft/', data);
}

deleteInvoice (invoice_id: String) {
return this._http.request(
  'delete',
  BASE_API_URL + TSAPIRoutes.performa,
  {
    body: {
      invoice_id: [
        invoice_id
      ]
    }
  }
);
}

addItem (data: any) {
    return this._http.post(BASE_API_URL + TSAPIRoutes.get_and_post_material, data);
}

updateItem (id,data: any) {
    return this._http.put(BASE_API_URL + TSAPIRoutes.get_and_post_material+id+'/', data);
}
getItem(){
    return this._http.get(BASE_API_URL + TSAPIRoutes.get_and_post_material);
}

getItemWithId(id){
    return this._http.get(BASE_API_URL + TSAPIRoutes.get_and_post_material+id+'/');
}

addExpenseItem (data: any) {
    return this._http.post(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.expense, data);
}


getExpenseItem (id) {
    return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.expense +id +'/');
}

updateExpenseItem (id,data) {
    return this._http.put(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.expense +id +'/',data);
}

deleteRecord(id){
    return this._http.delete(BASE_API_URL +  TSAPIRoutes.get_and_post_material+id+'/');
}

getAllLocations(){
    return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.from)
}

postNewLocation(data){
    return this._http.post(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.from ,data)
}

updateLocation(data,id){
    return this._http.put(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.from + id +'/' ,data)
}
}