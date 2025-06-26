import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BASE_API_URL, BASE_API_URL_V2, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';

@Injectable({
	providedIn: 'root'
})
export class PartyService {
	constructor(private _http: HttpClient) {}

	postPartyDetails(partyData: any): Observable<any> {
		return this._http.post(BASE_API_URL + TSAPIRoutes.party, partyData);
	}

	putPartyDetails(partyData: any, party_id: String): Observable<any> {
		return this._http.put(BASE_API_URL + TSAPIRoutes.party + party_id + '/', partyData);
	}

	getPartyDetails(partyId: String, params?: any): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.party + partyId + '/', {params: params});
	}

	getPartyDetailsV2( params: any): Observable<any> {
		return this._http.get(BASE_API_URL+TSAPIRoutes.party +'list_v2/', {params: params});
	}

	getLabourBillDetails(partyId: String, params?: any): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.report+'vendor/vendor_labour_bills/' + partyId + '/', {params: params});
	}
	

	getPartyData(partyType,typeOfTable,partyId,startDate, endDate,pageNumber,pageSize): Observable<any>{
		return this._http.get(BASE_API_URL + TSAPIRoutes.report + partyType+ '/' + typeOfTable+'/'+partyId+'/'+"?start_date=" + startDate + "&end_date=" + endDate+"&page="+pageNumber+"&page_size="+pageSize)
	}

	getTransactionSummary(partyType,typeOfTable,partyId,startDate, endDate): Observable<any>{
		return this._http.get(BASE_API_URL + TSAPIRoutes.report + partyType+ '/' + typeOfTable+'/'+partyId+'/'+"?start_date=" + startDate + "&end_date=" + endDate)
	}

	getVenderSummary(partyId: String, params?: any): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.report + TSAPIRoutes.vendor + TSAPIRoutes.vendorsummary +
			 partyId + '/', {params: params});
	}


	getPartyAdressDetails(partyId: String): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.party + partyId + '/gst/detail/');
	}

	getPartyList(vendor_party_type?,params?:any): Observable<any> {
		if (params)
            params = {party_type: params,vendor_party_type:vendor_party_type} ;
		return this._http.get(BASE_API_URL + TSAPIRoutes.party,{
			params:params
		});
	}
	getPartyListExcel(params){
		return this._http.get(BASE_API_URL + TSAPIRoutes.party+"list_v2/",{params,responseType: 'blob'})
	  }

	getPartyListV2(): Observable<any> {
		return this._http.get(BASE_API_URL_V2 + TSAPIRoutes.party + "parties/");
	}

	getTDSSections(): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.party + TSAPIRoutes.tds_section);
	}

	getPartyCreditNotes(partyId: String, params?:any): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + 'credit_note_by_party/' + partyId + '/', {
			params: {status: params}
		});
	}

	getPartyUnpaidCreditNotes(partyId: String): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + 'credit_note_by_party/unpaid/' + partyId + '/')
	}

	getSettlementPartyCreditNote(partyId: String, settlementId: String): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + 'credit_note_by_party/' + partyId + '/settlement/' + settlementId + '/');
	}

	getSettlementPartyBillOfSupply(partyId: String, settlementId: String): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + 'bos_by_party/' + partyId + '/settlement/' + settlementId + '/');
	  }


	getPartyDebitNotes(partyId: String, params?:any): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + 'debit_note_by_party/' + partyId + '/', {
			params: {status: params}
		});
	}

	getPartyUnpaidDebitNotes(partyId: String): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + 'debit_note_by_party/unpaid/' + partyId + '/')
	}

	getSettlementPartyDebitNote(partyId: String, settlementId: String): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + 'debit_note_by_party/' + partyId + '/settlement/' + settlementId + '/');
	}

	getPartyInvoices(partyId: String, invoice_status?:any, for_credit_note: string = '0'): Observable<any> {
		// TODO: change to invoice
		const params = {status: invoice_status, for_credit_debit: for_credit_note};
		return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + 'invoice_by_party/' + partyId + '/', {
			params: params
		});
	}

	getPartyUnpaidInvoices(partyId: String): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + 'invoice_by_party/unpaid/' + partyId + '/');
	}

	getPartyUnpaidBos(partyId: String): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + 'bos_by_party/unpaid/' + partyId + '/');
	}

  getPartyBos(partyId: String): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + 'bos_by_party/' + partyId + '/');
	}

	getSettlementPartyInvoices(partyId: String, settlementId: String): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + 'invoice_by_party/' + partyId + '/settlement/' + settlementId + '/');
	}

  getSettlementPartyBos(partyId: String, settlementId: String): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + 'bos_by_party/' + partyId + '/settlement/' + settlementId + '/');
	}

	getPartyAdvance(partyId: String, params?:any): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + 'customer_advance_by_party/' + partyId + '/', {
			params: {status: params}
		});
	}

	getPartyUnpaidAdvance(partyId: String): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + 'customer_advance_by_party/unpaid/' + partyId + '/');
	}

	getSettlementPartyAdvance(partyId: String, settlementId: String): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + 'customer_advance_by_party/' + partyId + '/settlement/' + settlementId + '/');
	}



  getPartyVendorCredits(partyId: String): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.operation + 'vendor_credit_by_party/' + partyId + '/');
  }

  getPartyVendorAdvances(partyId: String): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.operation + 'vendor_advance_by_party/' + partyId + '/');
  }

  getPartyBills(partyId: String): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.operation + 'bills_by_party/' + partyId + '/');
  }


  getPartyVendorCreditsSettlement(partyId: String, settlementId: String): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.operation + 'vendor_credit_by_party/' + partyId + '/settlement/' + settlementId + "/");
  }

  getPartyVendorAdvancesSettlement(partyId: String, settlementId: String): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.operation + 'vendor_advance_by_party/' + partyId + '/settlement/' + settlementId + "/");
  }

  getOperationLabourBill(partyId: String): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.operation + 'labour_bills_by_party/' + partyId + "/");
  }

  getOperationForemanBill(partyId: String): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.operation + 'foreman_bills_by_party/' + partyId + "/");
  }
  getPartyBillsSettlement(partyId: String, settlementId: String): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.operation + 'bills_by_party/' + partyId + '/settlement/' + settlementId + "/");
  }

  getPartyBillsSettlementLabour(partyId: String, settlementId: String): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.operation + 'labour_bills_by_party/' + partyId + '/settlement/' + settlementId + "/");
  }

  getPartyBillsSettlementForeman(partyId: String, settlementId: String): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.operation + 'foreman_bills_by_party/' + partyId + '/settlement/' + settlementId + "/");
  }

  inviteToClientPortal(partyId:string): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.party + 'portal/invite/' + partyId + '/');
  }

  reInviteToClientPortal(partyId:string): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.party + 'portal/reinvite/' + partyId + '/');
  }

  enableToClientPortal(partyId:string,isEnabled): Observable<any> {
    return this._http.put(BASE_API_URL + TSAPIRoutes.party + 'portal/access/' + partyId + '/',{disable:isEnabled});
  }

  addEmailToClientPortal(partyId:string,email): Observable<any> {
    return this._http.put(BASE_API_URL + TSAPIRoutes.party + 'email/' + partyId + '/',{email:email});
  }


	// deleteParty(partyId: String): Observable<any> {
	// 	return this._http.delete(BASE_API_URL + TSAPIRoutes.party + partyId + '/');
	// }
	deleteParty(partyId: String) {
		return this._http.request(
			'delete',
			BASE_API_URL + TSAPIRoutes.party,
			{
				body: {
					party_id: [
						partyId
					]
				}
			}
		);
	}

// party list new api for pary list ui
 getPartyListUI(params?:any): Observable<any> {
		if (params)
            params = {party_type: params} ;
		return this._http.get(BASE_API_URL + TSAPIRoutes.party_list,{
			params:params
		});
	}

	getContactPersonList(id): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.party+'contact_person/'+id+"/");
	}

	addPartyCertificate(body): Observable<any> {
		return this._http.post(BASE_API_URL + TSAPIRoutes.party+'certificate/add/',body);
	}
	
	updatePartyCertificate(body): Observable<any> {
		return this._http.post(BASE_API_URL + TSAPIRoutes.party+'certificate/update/',body);
	}
	
	getDefaultPartyCertificate(): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.party+'certificate/default/');
	}

	deletePartyItems(url,body): Observable<any> {
		return this._http.post(BASE_API_URL + url,body);
	  }


	  getKycPartyList(params): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.party+'pending_kycs/',{params:params});
	}

	getBillingPreference(partyId,vehicleCategory): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.party +`billing_preference/${partyId}/?category=${vehicleCategory}`);
	}
}
