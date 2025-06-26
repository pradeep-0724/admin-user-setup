import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TSAPIRoutes, BASE_API_URL } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class NewTripService {

  constructor(
    private _http: HttpClient
  ) { }


  getTrips(params): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.new_trip, { params: params });
  }

  getTripsV2(params): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + 'trip/vehicle/list/', { params: params });
  }

  getTripCounts(params): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + 'trip/vehicle/counts/', { params: params });
  }

  postTrips(body): Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.new_trip,body);
  }

  getTripsDetails(id): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.new_trip+id+'/')
  }

  deleteTripsDetails(id): Observable<any> {
    return this._http.delete(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.new_trip+id+'/')
  }

  postNewTripHead(id,body){
    return this._http.put(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.new_trip+'head/'+id+'/',body);
  }

  postCustomFieldData(id,body){
    return this._http.put(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.new_trip+'customfield/'+id+'/',body);
  }

  putNewTripAdd(id,body,type){
    return this._http.put(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.new_trip+type+'/'+id+'/',body);
  }

  getTripSubDetails(id, type, params){
    return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.new_trip + type + '/'+ id +'/', {params: params});
  }

  postTripType(id, data, type) {
    return this._http.post(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.new_trip + type+ '/' + id + '/', data);
  }

  postAddNewVehicle(data) {
    return this._http.post(BASE_API_URL + TSAPIRoutes.revenue + 'new_trip_vehicle_add/', data);
  }

  getTripFields(to_add): Observable<any> {
    return this._http.get(BASE_API_URL +TSAPIRoutes.revenue_formfield_vehicle_trip,{params:{to_add}})
  }

  getVehicleInLoop(id): Observable<any> {
    return this._http.get(BASE_API_URL +TSAPIRoutes.revenue+"vehicle_in_loop/"+id+"/")
  }

  getCloseLoop(id): Observable<any> {
    return this._http.get(BASE_API_URL +TSAPIRoutes.revenue+"close_loop/"+id+"/")
  }


  getPrefillLoopData(id): Observable<any> {
    return this._http.get(BASE_API_URL +TSAPIRoutes.revenue+"prefill_data_for_loop_trip/"+id+"/")
  }



  deleteTripType(id, type) {
    return this._http.delete(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.new_trip + type+ '/' + id + '/');
  }

  postOnlineBilty(body): Observable<any>{
    return this._http.post(BASE_API_URL + TSAPIRoutes.revenue+"builty/",body);

  }

  postVehicleProviderSlip(body): Observable<any>{
    return this._http.post(BASE_API_URL + TSAPIRoutes.revenue+"market_slip/",body);

  }

  deleteVehicleProviderSlip(id): Observable<any>{
    return this._http.delete(BASE_API_URL + TSAPIRoutes.revenue+"market_slip/"+id+"/");

  }

  getVehicleProviderSlip(id): Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.revenue+"market_slip/"+id+"/");

  }

  putVehicleProviderSlip(id,body): Observable<any>{
    return this._http.put(BASE_API_URL + TSAPIRoutes.revenue+"market_slip/"+id+"/",body);

  }

  putOnlineBilty(id,body): Observable<any>{
    return this._http.put(BASE_API_URL + TSAPIRoutes.revenue+"builty/"+id+"/",body);
  }

  detailOnlineBilty(id): Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.revenue+ "builty/view/" + id + "/");
  }

  detailMvs(id): Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + "market_slip/view/" + id + "/");
  }

  postOnlineBiltyDemurrageInsurance(body,id): Observable<any>{
    return this._http.put(BASE_API_URL + TSAPIRoutes.revenue+"builty/insurance/"+id+"/",body);

  }

  getTripBills(id): Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.revenue +'trip/bills/'+id+'/')
  }

  deleteOnlineBilty(id): Observable<any>{
    return this._http.delete(BASE_API_URL +TSAPIRoutes.revenue +'builty/'+id+'/')
  }

  getOnlineBilty(id): Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.revenue +'builty/'+id+'/')
  }

  getDriverBalance(id) : Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.revenue +TSAPIRoutes.trip+"driver/balance/"+id+"/")
  }

  postDriverLedger(body): Observable<any>{
    return this._http.post(BASE_API_URL +TSAPIRoutes.revenue +TSAPIRoutes.trip+TSAPIRoutes.driver_ledger,body)
  }

  getDriverLedger(id): Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.revenue +TSAPIRoutes.trip+TSAPIRoutes.driver_ledger+id+"/")
  }

  putDriverLedger(id,body): Observable<any>{
    return this._http.put(BASE_API_URL +TSAPIRoutes.revenue +TSAPIRoutes.trip+TSAPIRoutes.driver_ledger+id+"/",body)
  }

  deleteDriverLedger(id): Observable<any>{
    return this._http.delete(BASE_API_URL +TSAPIRoutes.revenue +TSAPIRoutes.trip+TSAPIRoutes.driver_ledger+id+"/")
  }

  getVehicleListExcel(type,is_transporter,start_date,end_date){
    return this._http.get(BASE_API_URL + TSAPIRoutes.revenue +TSAPIRoutes.trip+ TSAPIRoutes.vehicle+'list/',{params:{status:type,is_transporter:is_transporter,export:'true',start_date:start_date,end_date:end_date},responseType: 'blob'})
  }


  getFuelStock(vehicleId,date): Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle +'get_fuel_stock/'+vehicleId+"/"+date+"/")

  }

  getToPayList(id):Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.revenue +TSAPIRoutes.trip +'topay/'+id+"/")

  }

  postToPay(key,body,id):Observable<any>{
    return this._http.post(BASE_API_URL + TSAPIRoutes.revenue +TSAPIRoutes.trip +'topay/'+key+"/"+id+"/",body)
  }

  deletePay(key,id):Observable<any>{
    return this._http.delete(BASE_API_URL + TSAPIRoutes.revenue +TSAPIRoutes.trip +'topay/remove/'+key+"/"+id+"/")
  }

  startTrip(id):Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.revenue +TSAPIRoutes.trip +'start/'+id+"/")
  }

  getLngLat(id,current):Observable<any>{
    return this._http.get(BASE_API_URL + 'company/driver-app/' +TSAPIRoutes.trip +'driverloc/'+id+"/",{params:{'current':current}})
  }

}


@Injectable({
  providedIn: 'root'
})
export class NewTripGetApiService {

  constructor(
    private _tripService: NewTripService,
  ) { }

  getCustomFields(customFieldDetailsCb){
    let $sub = this._tripService.getTripFields(true).subscribe((data:any)=>{
       customFieldDetailsCb(data['result'])
     },err => { customFieldDetailsCb([])},
     ()=>{setTimeout(() => {$sub.unsubscribe()}, 1000);})
   }
  }
