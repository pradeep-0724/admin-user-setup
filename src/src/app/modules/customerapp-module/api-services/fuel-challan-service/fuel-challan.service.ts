import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';

@Injectable()
export class FuelChallanService {

  constructor(
    private _httpService: HttpClient
  ) { }


  postFuelChallans(body):Observable<any>{
      return this._httpService.post(BASE_API_URL+'revenue/unpaid_fuel_challan/',body)
  }



  deleteFuelChallans(id):Observable<any>{
    return this._httpService.delete(BASE_API_URL+'revenue/unpaid_fuel_challan/'+id+'/')
}

putFuelChallans(body,id):Observable<any>{
  return this._httpService.put(BASE_API_URL+'revenue/unpaid_fuel_challan/'+id+'/',body)
}

  getFuelChallans(params):Observable<any>{
    return this._httpService.get(BASE_API_URL+'revenue/unpaid_fuel_challan/',{params:params})
}
getFuelPrice(params?: any): Observable<any> {
  return this._httpService.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.fuel_rate, { params: params });
}



}
