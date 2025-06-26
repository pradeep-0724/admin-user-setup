import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { TSAPIRoutes, BASE_API_URL } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class RevenueService {

  constructor(private http: HttpClient) { }

 
  postDisclaimer(data): Observable<any> {
    return this.http.post(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.disclaimer, data)
  }




  getPaginatedData(url,startDate,endDate,pageNumber,pageSize){
    if(startDate && endDate){
    return this.http.get( BASE_API_URL + url , { params: { start_date: startDate, end_date: endDate, page: pageNumber, page_size: pageSize}});
    }
    else{
      return this.http.get( BASE_API_URL + url , { params: {  page: pageNumber, page_size: pageSize}});
    }
  }

  getSearchPaginatedData(url,startDate,endDate,pageNumber,pageSize,searchValue){
    if(startDate && endDate){
    return this.http.get( BASE_API_URL + url , { params: { start_date: startDate, end_date: endDate, page: pageNumber, page_size: pageSize, search_query: searchValue}});
    }
    else{
      return this.http.get( BASE_API_URL + url , { params: { page: pageNumber, page_size: pageSize, search_query: searchValue}});
    }
  }

  getFilterData(url,data,searchValue,startDate,endDate,pageSize,pageNumber):Observable<any>{
    if(searchValue){
      return this.http.get(BASE_API_URL + url,{params: {filter_set: JSON.stringify(data) ,search_query:searchValue,start_date:startDate,end_date:startDate, page_size: pageSize ,page: pageNumber}})
    }
    else{
      return this.http.get(BASE_API_URL + url,{params: {filter_set: JSON.stringify(data),start_date:startDate,end_date:endDate,page_size: pageSize,page: pageNumber}})
    }
  }

}
