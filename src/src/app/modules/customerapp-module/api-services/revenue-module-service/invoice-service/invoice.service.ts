import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { Observable} from 'rxjs';


@Injectable({
  providedIn:'root'
})
export class InvoiceService {

    constructor(
        private _http: HttpClient
    ) { }
    
    getInvoiceList (params) {
        return this._http.get(BASE_API_URL + TSAPIRoutes.invoice+TSAPIRoutes.list,{ params});
    }

    getInvoiceTypesCount(start_date,end_date):Observable<any>{
        return this._http.get(BASE_API_URL + TSAPIRoutes.invoice+ TSAPIRoutes.status_count,{params:{start_date,end_date}});
    }
    getInvoiceHistory(invoice_id: string){
        return this._http.get(BASE_API_URL + TSAPIRoutes.invoice +'log/' + invoice_id + '/');

    }

    saveInvoice(invoiceDetails): Observable<any> {
        return this._http.post(BASE_API_URL + TSAPIRoutes.invoice, invoiceDetails);
    }

    getInvoiceDetail (invoice_id: string) {
        return this._http.get(BASE_API_URL + TSAPIRoutes.invoice  + invoice_id + '/');
    }
    getInvoiceExport (params) :Observable<Blob>{
      return this._http.get(BASE_API_URL + TSAPIRoutes.invoice+TSAPIRoutes.list,{params:params,responseType: 'blob'});
  }
    getInvoicePrintView (invoice_id: string) {
        return this._http.get(BASE_API_URL + TSAPIRoutes.invoice  + invoice_id + '/printview/');
    }

    editInvoiceNote (data: any, invoice_id: string) {
        return this._http.put(BASE_API_URL + TSAPIRoutes.invoice + invoice_id + '/', data);
    }

    postInvoiceAsDraft (data: any) {
        return this._http.post(BASE_API_URL + TSAPIRoutes.invoice_draft, data);
    }

    putInvoiceAsDraft (data: any, invoice_id) {
        return this._http.put(BASE_API_URL + TSAPIRoutes.edit_invoice_draft + invoice_id + '/draft/', data);
    }

    deleteInvoice (invoice_id: String) {
		return this._http.request(
			'delete',
			BASE_API_URL + TSAPIRoutes.invoice,
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

    getTripDocumentChallan (invoice_id: string) {
        return this._http.get(BASE_API_URL + TSAPIRoutes.invoice +"trip_challan_documents/"  + invoice_id + '/');
    }
    getInvoiceLiveStatus(): Observable<any> {
        return this._http.get(BASE_API_URL  + TSAPIRoutes.invoice+'live_status/');
      }

      getInvoiceDetailsView(id): Observable<any> {
        return this._http.get(BASE_API_URL+'revenue/invoice/view/'+id+'/');
      }
      getInvoiceTimesheets(id){
        return this._http.get(BASE_API_URL+'revenue/invoice/timesheet/view/'+id+'/');
      }

      getTripCraneAwpTimesheetByParty(type,partyId): Observable<any> {
        return this._http.get(BASE_API_URL + `revenue/invoice/timesheets/party/${partyId}/?category=${type}`);
      }

      getTripCraneAwpChargesByParty(type,partyId): Observable<any> {
        return this._http.get(BASE_API_URL + `revenue/invoice/workorder/charges/party/${partyId}/?category=${type}`);
      }


      getCraneAwpJobChargesByParty(type,partyId): Observable<any> {
        return this._http.get(BASE_API_URL + `revenue/invoice/charges/party/${partyId}/?category=${type}`);
      }

      getCraneAwpJobDeductionsByParty(type,partyId): Observable<any> {
        return this._http.get(BASE_API_URL + `revenue/invoice/deductions/party/${partyId}/?category=${type}`);
      }

      checkJobsByCustomer(customerid,invoiceId): Observable<any>{
        return this._http.get(BASE_API_URL + `revenue/invoice/items/exists/${customerid}/?invoice=${invoiceId}`);
      }
    
    

}
