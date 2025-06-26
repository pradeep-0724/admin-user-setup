import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {  BASE_API_URL } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class CustomFilterService {



  constructor(private _http: HttpClient) { }


  getFilterData(url,data,searchValue,startEndDate,pageSize):Observable<any>{
    if(searchValue){
      return this._http.get(BASE_API_URL + url,{params: {filter_set: JSON.stringify(data) , search_query:searchValue,start_date:startEndDate['start_date'],end_date:startEndDate['end_date'], page_size: pageSize }})
    }
    else{
      return this._http.get(BASE_API_URL + url,{params: {filter_set: JSON.stringify(data),start_date:startEndDate['start_date'],end_date:startEndDate['end_date'],page_size: pageSize }})
    }
  }


}
