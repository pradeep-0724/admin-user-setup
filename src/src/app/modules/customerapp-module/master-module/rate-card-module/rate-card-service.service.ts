import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class RateCardServiceService {

  constructor(private _http: HttpClient) {}
  
	postRentalRateCard(rateCardData: any): Observable<any> {
		return this._http.post(BASE_API_URL + TSAPIRoutes.company_add + "ratecard/", rateCardData);
	}
	putRentalRateCard(rateCardID, rateCardData: any): Observable<any> {
		return this._http.put(BASE_API_URL + TSAPIRoutes.company_add + "ratecard/" + rateCardID + "/", rateCardData);
	}

	getZonesList(): Observable<any> {
		return this._http.get(BASE_API_URL + 'zone/name/get/');
	}

	getRentalRateCard(ratecard): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.company_add + "ratecard/" + ratecard + '/');
	}

	getRentalRateCardList(params): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.company_add + 'ratecard/', { params: params });
	}

	deleteRentalRateCard(id): Observable<any> {
		return this._http.delete(BASE_API_URL + TSAPIRoutes.company_add + 'ratecard/'+ id + '/');
	}
}
