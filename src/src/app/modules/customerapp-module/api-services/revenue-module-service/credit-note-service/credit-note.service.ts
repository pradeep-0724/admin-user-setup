import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn:'root'
})
export class CreditService {

    constructor(
        private _http: HttpClient
    ) { }

    postCreditNote(data) {
        return this._http.post(BASE_API_URL + TSAPIRoutes.credit_add, data);
    }

    postCreditNoteDraft(data) {
        return this._http.post(BASE_API_URL + TSAPIRoutes.credit_note_draft, data);
    }

    getInvoiceList () {
        return this._http.get(BASE_API_URL + TSAPIRoutes.invoice);
    }

    getCreditNoteList (params?:any) {
        // if (params)
        //     params = {status: params};
        return this._http.get(BASE_API_URL + TSAPIRoutes.credit_add+TSAPIRoutes.list, {
			params
		});
    }

    getcreditNoteDetails (credit_id: string) {
        return this._http.get(BASE_API_URL + TSAPIRoutes.credit_add + credit_id + '/');
    }

    getCreditNotePrintView (credit_id: string) {
        return this._http.get(BASE_API_URL + TSAPIRoutes.credit_add + credit_id + '/printview/');
    }

    editCreditNote (data: any, credit_id: string) {
        return this._http.put(BASE_API_URL + TSAPIRoutes.credit_add + credit_id + '/', data);
    }

    putCreditNoteAsDraft (data: any, credit_id: string) {
        return this._http.put(BASE_API_URL + TSAPIRoutes.credit_add + credit_id + '/draft/', data);
    }

    deleteCreditNote (credit_note_id: String) {
		return this._http.request(
			'delete',
			BASE_API_URL + TSAPIRoutes.credit_add,
			{
				body: {
					credit_note_id: [
						credit_note_id
					]
				}
			}
		);
    }

    getInvoiceChallanList(invoice_id): Observable<any> {
        return this._http.get(BASE_API_URL + TSAPIRoutes.invoice_challan + invoice_id + '/');
    }

}
