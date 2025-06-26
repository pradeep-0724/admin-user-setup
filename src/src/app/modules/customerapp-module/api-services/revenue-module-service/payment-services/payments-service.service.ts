import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TSAPIRoutes, BASE_API_URL } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  constructor(
    private _http: HttpClient
  ) { }

  addInvoicePayment(data) {
    return this._http.post(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.payment_settlement, data);
  }

  addCustomerAdvance(data) {
    return this._http.post(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.customer_advance, data);
  }

  addRefundVoucher(data) {
    return this._http.post(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.refund_voucher, data);
  }
  getRefundSuggestedIds(params) {
    if (params)
        params = {key: params} ;
    return this._http.get(BASE_API_URL + TSAPIRoutes.suggested_ids, {
        params: params
    });
  }

  savePaymentSettelmentAsDraft(data) {
    return this._http.post(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.payment_settlement + 'draft/', data);
  }

  updatePaymentSettelmentAsDraft(data,invoice_id: string) {
    return this._http.put(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.payment_settlement + invoice_id  + '/draft/', data);
  }

  editCoutomerAdvance (data: any, advance_id: string) {
    return this._http.put(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.customer_advance + advance_id + '/', data);
  }

  editInvoicePayment (data: any, invoice_id: string) {
    return this._http.put(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.payment_settlement + invoice_id + '/', data);
  }

  deleteInvoicePayment (payment_id: String) {
		return this._http.request(
			'delete',
			BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.payment_settlement,
			{
				body: {
					payment_settlement_ids: [
						payment_id
					]
				}
			}
		);
  }

  deleteAdvance (payment_id: String) {
		return this._http.request(
			'delete',
			BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.customer_advance,
			{
				body: {
					advance_detail_ids: [
						payment_id
					]
				}
			}
		);
  }

  editRefund (data: any, refund_id: string) {
    return this._http.put(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.refund_voucher + refund_id + '/', data);
  }

  getInvoiceDetail (invoice_id: string) {
    return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.payment_settlement + invoice_id + '/');
  }
  getPaymentSettlementPrintViewDetails (invoice_id: string) {
    return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.payment_settlement_print_view + invoice_id + '/');
  }

  getRefundDetail (refund_id: string) {
    return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.refund_voucher + refund_id + '/');
  }

  getCoutomerAdvance (advance_id: string) {
    return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.customer_advance + advance_id + '/');
  }
  getAdvancePrintViewDetails (advance_id: string) {
    return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.customer_advance + advance_id + '/printview/');
  }

  getInvoiceList (params) {
    return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.payment_settlement+TSAPIRoutes.list,{params});
  }

  getCustomerAdvance(params) {
    return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.customer_advance+TSAPIRoutes.list,{params});
  }

  getRefundVoucher(params) {
    return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.refund_voucher+TSAPIRoutes.list,{params});
  }

  deleteRefund (refund_id: String) {
		return this._http.request(
			'delete',
			BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.refund_voucher,
			{
				body: {
					payment_refund_ids: [
						refund_id
					]
				}
			}
		);
  }
  
  getSuggestedIds(keysRequired): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.suggested_ids + '?key=' + keysRequired);
  }

  getTersmAndConditionList(): Observable<any> {
    return this._http.get(BASE_API_URL +'setting/tc/?key=advance')
  }
}
