import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';

@Injectable({
	providedIn: 'root'
})
export class RateCardService {
	constructor(private _http: HttpClient) {}

	postRentalRateCard(partyData: any): Observable<any> {
		return this._http.post(BASE_API_URL + TSAPIRoutes.party +"ratecard/", partyData);
	}
	putRentalRateCard(rateCardID, partyData: any): Observable<any> {
		return this._http.put(BASE_API_URL + TSAPIRoutes.party +"ratecard/"+rateCardID+"/", partyData);
	}
	getSelectedSpecificationValues(partyId,specID): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.party +partyId+"/ratecard/specification/"+specID+"/");
	}

	getDefaultRateCardBySpecZoneBillCate(partyId,params): Observable<any> {
		return this._http.get(BASE_API_URL  +"company/"+partyId +"/ratecard/rentalcharges/",{params:params});
	}
	getDefaultCommonRateCardBySpecZoneBillCate(params): Observable<any> {
		return this._http.get(BASE_API_URL  +"company/ratecard/rentalcharges/",{params:params});
	}
	
	
	
	getRentalRateCard(partyId,ratecard): Observable<any> {
		let params = {
			ratecard_id : ratecard
		}
		return this._http.get(BASE_API_URL + TSAPIRoutes.party +partyId +"/ratecard/",{params:params});
	}
	getRentalRateCardList(partyId): Observable<any> {
		
		return this._http.get(BASE_API_URL + TSAPIRoutes.party +partyId +"/ratecard/");
	}

	postAdditionalChargesRateCard(partyData: any): Observable<any> {
		return this._http.post(BASE_API_URL + TSAPIRoutes.party +"additionalcharges/", partyData);
	}
	putAdditionalChargesRateCard(rateCardID, partyData: any): Observable<any> {
		return this._http.put(BASE_API_URL + TSAPIRoutes.party +"additionalcharges/"+rateCardID+"/", partyData);
	}
	
	deleteRateCard(api,id: any): Observable<any> {
		return this._http.delete(BASE_API_URL + TSAPIRoutes.party +api+"/" +id+"/");
	}
	getAdditionalChargesRateCardList(partyId): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.party +partyId +"/additionalcharges/");
	}

	getSelectedChargeValues(partyId,specID): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.party +partyId+"/additionalcharges/charge/"+specID+"/");
	}
	getAdditionalChargesRateCard(partyId,ratecard): Observable<any> {
		// let params = {
		// 	ac_id : ratecard
		// }
		return this._http.get(BASE_API_URL + TSAPIRoutes.party +"additionalcharges/get_for_update/"+ ratecard+'/');
	}

	getZonesList(): Observable<any> {
		return this._http.get(BASE_API_URL + 'zone/name/get/');
	}
	// additional charge v2
	postAdditionalChargePopUpDate(data: any): Observable<any> {
		return this._http.post(BASE_API_URL + TSAPIRoutes.item, data);
	}
	upDateAdditionalChargePopUpDate(id,data: any): Observable<any> {
		return this._http.put(BASE_API_URL + TSAPIRoutes.item+id+'/',data);
	}
	deleteAdditionalChargePopUpDate(id: string): Observable<any> {
		return this._http.delete(BASE_API_URL + TSAPIRoutes.vehicle +"additional_charge/delete/"+ id+'/');
	}
	checkUniqueCharge(params: any): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle +"additional_charge/check/", {params : params});
	}
	getAdditionalCharges(): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle +"additional_charge/get/");
	}
	postAdditionalChargesData(data): Observable<any> {
		return this._http.post(BASE_API_URL + TSAPIRoutes.party +"additionalcharge/add/",data);
	}
	putAdditionalChargesData(data): Observable<any> {
		return this._http.post(BASE_API_URL + TSAPIRoutes.party +"additionalcharges/",data);
	}


	getRentalCharges(partyId,params): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.company_add +partyId +"/ratecard/rentalcharges/",{params:params});
	}

	getCustomerAdditionalCharge(partyId,params): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.party +partyId +"/ratecard/additionalcharges/",{params:params});
	}
	// Customer Rate Card
	getCustomerRateCardDetails(partyId): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.party +partyId+"/ratecard/container/");
	}
	getCommonRateCardDetails(): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.company_add +'ratecard/container/');
	}
	postCustomerRateCard(rateCardData: any): Observable<any> {
		return this._http.post(BASE_API_URL + TSAPIRoutes.party + "ratecard/", rateCardData);
	}
	putCustomerRateCard(rateCardID,rateCardData: any): Observable<any> {
		return this._http.put(BASE_API_URL + TSAPIRoutes.party + "ratecard/"+rateCardID+'/', rateCardData);
	}




}