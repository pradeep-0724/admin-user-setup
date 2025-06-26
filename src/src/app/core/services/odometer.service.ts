import { BASE_API_URL } from './../constants/api-urls.constants';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class OdometerService {

  constructor(
    private _httpService: HttpClient
  ) { }

  getOdometerReading(id,date){
    return this._httpService.get(BASE_API_URL +'vehicle/odometer/'+id+'/',{params: {date}});
  }

  getHourReading(id,date){
    return this._httpService.get(BASE_API_URL +'vehicle/odometer/'+id+'/',{params: {date:date,is_time:true}});
  }

  checkOdometerReading(id, date, odometer, activity_id=""){
    return this._httpService.get(BASE_API_URL +'vehicle/validate/odometer/'+id+'/',{params: {date,odometer,activity_id}});
  }

  checkHourReading(id, date, hour, activity_id=""){
    return this._httpService.get(BASE_API_URL +'vehicle/validate/odometer/'+id+'/',{params: {date,hour,activity_id,is_time:true}});
  }


}
