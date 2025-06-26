import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class OperationsPaymentService {
	constructor(private _http: HttpClient) {}

	postNewAdvancePayment(advanceDetatils): Observable<any> {
		return this._http.post(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.advance_payment, advanceDetatils);
	}

	putNewAdvancePayment(advanceDetatils, vendor_advance_id): Observable<any> {
		return this._http.put(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.advance_payment  + vendor_advance_id + '/', advanceDetatils);
	}

	postNewVendorCredit(vendorCreditDetails): Observable<any> {
		return this._http.post(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.vendor_credit, vendorCreditDetails);
	}

	putNewVendorCredit(vendorCreditDetails, vendor_credit_id): Observable<any> {
		return this._http.put(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.vendor_credit + vendor_credit_id + '/', vendorCreditDetails);
	}

	postNewBillPayment(billPaymentDetails): Observable<any> {
		return this._http.post(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.bills_payment, billPaymentDetails);
	}

	putNewBillPayment(billPaymentDetails, bill_payment_id): Observable<any> {
		return this._http.put(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.bills_payment + bill_payment_id + '/',
		billPaymentDetails);
	}

	getVendorCredits(): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.vendor_credit);
	}

	getVendorAdvances(): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.vendor_advance);
	}

	getVendorList (params:any) {
		return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.vendor_credit+TSAPIRoutes.list,{
			params
		});
	}

	getVendorCreditStatus () {
		return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.vendor_credit_status);
	}

	getPaymentHistory (params) {
		return this._http.get(BASE_API_URL + TSAPIRoutes.get_payment_history+TSAPIRoutes.list,{params});
	}

	getVendorAdvanceList (params) {
		return this._http.get(BASE_API_URL + TSAPIRoutes.vendor_advance_list+TSAPIRoutes.list,{params});
	}

	getBillPaymentDetails(bill_payment_id: any) {
		return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.bills_payment + bill_payment_id + '/').pipe(
		  map((response) => {
			return response;
		  })
		);
	}

  getBillPaymentView(bill_payment_id: any) {
		return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.bills_payment+ 'printview/'+ bill_payment_id + '/').pipe(
		  map((response) => {
			return response;
		  })
		);
	}

	getVendorAdvanceDetails(vendor_advance_id: any) {
		return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.advance_payment + vendor_advance_id + '/').pipe(
		  map((response) => {
			return response;
		  })
		);
	}

	getVendorCreditDetails(vendor_credit_id: any): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.vendor_credit + vendor_credit_id + '/').pipe(
			map((response) => {
			  return response;
			})
		  );
	}

	deleteBillPayment (payment_id: String) {
		return this._http.request(
			'delete',
			BASE_API_URL + TSAPIRoutes.get_payment_history,
			{
				body: {
					bill_payment_ids: [
						payment_id
					]
				}
			}
		);
	}

	deleteVendorAdvance (advance_id: String) {
		return this._http.request(
			'delete',
			BASE_API_URL + TSAPIRoutes.vendor_advance_list,
			{
				body: {
					payment_ids: [
						advance_id
					]
				}
			}
		);
	}

	deleteVendorCredit (credit_id: String) {
		return this._http.request(
			'delete',
			BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.vendor_credit,
			{
				body: {
					vendor_credit_id: [
						credit_id
					]
				}
			}
		);
	}

	getVendorAdvance(id):Observable<any>{
	return this._http.get(BASE_API_URL+TSAPIRoutes.operation+TSAPIRoutes.vendor_advance_by_party+TSAPIRoutes.get_fleet_owner_print+id+'/');
	  }
	  getPrefixOperationsIds(key): Observable<any> {
		return this._http.get(BASE_API_URL +  TSAPIRoutes.operation+'suggested_ids/?key='+key);
	  }
}
