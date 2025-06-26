import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';


@Injectable(
  {
    providedIn:'root'
  }
)
export class DebitService {

    constructor(
        private _http: HttpClient
    ) { }

    postDebitNote(data) {
        return this._http.post(BASE_API_URL + TSAPIRoutes.debit_add, data);
    }

    postDebitNoteAsDraft (data) {
        return this._http.post(BASE_API_URL + TSAPIRoutes.debit_note_draft, data);
    }

    getChallan () {
        return this._http.get(BASE_API_URL + TSAPIRoutes.challan);
    }

    getPartyList (params?:any) {
        if (params)
            params = {party_type: params} ;
        return this._http.get(BASE_API_URL + TSAPIRoutes.party, {
            params: params
        });
    }

    getPartyAddress (party_id:string) {
        return this._http.get(BASE_API_URL + TSAPIRoutes.party + party_id + '/');
    }

    getPaymentTerm () {
        return this._http.get(BASE_API_URL + TSAPIRoutes.payment_term);
    }

    getDebitNoteList (params:any) {
        return this._http.get(BASE_API_URL + TSAPIRoutes.debit_add+TSAPIRoutes.list, { params });
    }

    getInvoiceList () {
        return this._http.get(BASE_API_URL + TSAPIRoutes.invoice);
    }

    getDebitSuggestedIds(){
        return this._http.get(BASE_API_URL + TSAPIRoutes.debit_suggested);
    }

    getCreditSuggestedIds(){
        return this._http.get(BASE_API_URL + TSAPIRoutes.credit_suggested);
    }

    getDebitNoteDetails (debitNoteId: string) {
        return this._http.get(BASE_API_URL + TSAPIRoutes.debit_add + debitNoteId + '/')
    }

    getDebitNotePrintView(debitNoteId: string) {
        return this._http.get(BASE_API_URL + TSAPIRoutes.debit_add + debitNoteId + '/printview/')
    }

    editDebitNote (data: any, debit_id: string) {
        return this._http.put(BASE_API_URL + TSAPIRoutes.debit_add + debit_id + '/', data);
    }

    putDebitNoteAsDraft (data: any, debit_id: string) {
        return this._http.put(BASE_API_URL + TSAPIRoutes.debit_add + debit_id + '/draft/', data);
    }

    deleteDebitNote (debit_note_id: String) {
		return this._http.request(
			'delete',
			BASE_API_URL + TSAPIRoutes.debit_add,
			{
				body: {
					debit_note_id: [
						debit_note_id
					]
				}
			}
		);
	}

}
