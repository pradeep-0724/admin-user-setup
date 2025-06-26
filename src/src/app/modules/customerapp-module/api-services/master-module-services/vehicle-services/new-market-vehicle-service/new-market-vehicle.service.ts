import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class NewMarketVehicleService {

  constructor(private _http: HttpClient) {}

  getDefaultVehicleDocuments(id): Observable<any> {
    let queryParams ={
      vehicle_type :id,
      is_market : true
    }
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle+'documents/',{params : queryParams});
  }

  createMarketVehicle(data): Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.vehicle+'market/',data);
  }

  getMarketVehicleData(id): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle+'market/'+id+'/');
  }

  updateMarketVehicleData(id,data): Observable<any> {
    return this._http.put(BASE_API_URL + TSAPIRoutes.vehicle+'market/'+id+'/',data);
  }

  getNewMarketVehicleList(params): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle+'market/',{params:params});
  }

  deleteMarketVehicel(id) : Observable <any>{
    return this._http.delete(BASE_API_URL + TSAPIRoutes.vehicle+'market/'+id+'/');
  }

  activateMarketVehicel(id) : Observable <any>{
    return this._http.post(BASE_API_URL + TSAPIRoutes.vehicle+'market/activate/' + id+'/',{});
  }

  exportMarketVehicelList(params) : Observable <any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle+'market/', {params: params, responseType: 'blob'});
  }

  addDefaultDocument(data): Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.vehicle+'documents/add/',data);
  }

  updateDefaultDocument(data): Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.vehicle+'documents/update/',data);
  }

  checkDefaultDocument(data): Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.vehicle+'documents/exists/',data);
  }

  deleteDefaultDocument(data): Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.vehicle+'documents/delete/',data);
  }
  // //////////////// details apis

  marketVehicleHeaderDetails(id): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle+'market/activeness/'+id+'/');
  }

  marketVehicleInfoDetails(id): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle+'market/info/'+id+'/');
  }

  marketVehicleCertificates(id): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle+'documents/'+id+'/');
  }

  marketVehicleTripList(id,params): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.report+'market/'+TSAPIRoutes.vehicle+TSAPIRoutes.trip+TSAPIRoutes.list+id+'/',{params :params});
  }

  marketVehicleTripHeader(id,params): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.report+'market/'+TSAPIRoutes.vehicle+TSAPIRoutes.trip+'head/'+id+'/',{params :params});
  }
}
