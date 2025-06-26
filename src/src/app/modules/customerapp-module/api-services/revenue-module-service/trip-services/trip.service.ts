import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TSAPIRoutes, BASE_API_URL, BASE_API_URL_V2 } from 'src/app/core/constants/api-urls.constants';
import { Observable } from 'rxjs';
import { ValidationConstants } from 'src/app/core/constants/constant';

@Injectable({
	providedIn: 'root'
})
export class TripService {
	accountType = new ValidationConstants().accountType.join(',');
	constructor(private _http: HttpClient) { }

	getTripList(params?: any): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.trip, { params: params });
	}

	getFuelPrice(params?: any): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.fuel_rate, { params: params });
	}


	deleteTripDetails(tripId): Observable<any> {
		return this._http.delete(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.trip + tripId + '/');
	}

	getTripDetails(tripId): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.trip + tripId + '/');
	}

	getCurrentLoop(vehicleId: String): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.current_trip + vehicleId + '/');
	}

	saveTrip(tripDetails): Observable<any> {
		return this._http.put(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.save_trip, tripDetails);
	}

	endTrip(tripDetails): Observable<any> {
		return this._http.put(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.end_trip, tripDetails);
	}

	endLoop(tripDetails): Observable<any> {
		return this._http.put(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.end_loop, tripDetails);
	}

	getAccounts(params?: any) {
		return this._http.get(BASE_API_URL + TSAPIRoutes.chart_of_account, { params: params });
	}

	getAccountsV2(params?: any) {
		return this._http.get(BASE_API_URL_V2 + TSAPIRoutes.chart_of_account, { params: params });
	}

	getConsignor(): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.consignor);
	}
	getConsignee(): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.consignee);
	}

	from(): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.from);
	}

	to(): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.to);
	}

	quantity(): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.quanity_unit);
	}

	saveReason(payload) {
		return this._http.post(BASE_API_URL + TSAPIRoutes.vehicle_reason, payload);
	}

	getClientExpenseAccounts() {
		return this._http.get(BASE_API_URL + TSAPIRoutes.trip_client_expense_accounts);
	}

	getTransportVehicle() {
		return this._http.get(BASE_API_URL + 'party/vehicle/');
	}

	getTransportVehicleWithEmployeeList(params) {
		return this._http.get(BASE_API_URL + 'party/vehicle/',{ params: params });
	}

	getTranportCurrentLoop() {
		return this._http.get(BASE_API_URL + TSAPIRoutes.transport_current_loop);
	}

	getVendorList(params: any): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.party + '?party_type=' + params);
	}

	saveTransportTrip(body) {
		return this._http.put(BASE_API_URL + TSAPIRoutes.save_transport_trip, body);
	}

	endTransporterTrip(body) {
		return this._http.put(BASE_API_URL + TSAPIRoutes.end_trans_trip, body);
	}

	getTransporterTripDetail(id) {
		return this._http.get(BASE_API_URL + TSAPIRoutes.get_transport_trip + id + '/');
	}

	getTransporterTripList(params) {
		return this._http.get(BASE_API_URL + TSAPIRoutes.get_transport_trip, { params: params });
	}

	deleteTransporterTrip (id) {
		return this._http.delete(BASE_API_URL + TSAPIRoutes.get_transport_trip + id + '/');
	}

  getEmployee(start_date,end_date){
    let designation='Helper,Driver'
		return this._http.get(BASE_API_URL + TSAPIRoutes.employee_list,{params:{start_date,end_date,designation}});
  }
}
