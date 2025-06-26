import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class LpoService {

  constructor(
    private _http:HttpClient
  ) { }

saveLpo(data): Observable<any> {
    return this._http.post(BASE_API_URL + 'operation/lpo/', data);
}

getLpoList(params): Observable<any> {
  return this._http.get(BASE_API_URL +'operation/lpo/',{params});
}
getAssignedJobsList(id,params): Observable<any> {
  return this._http.get(BASE_API_URL +'operation/lpo/job/list/'+id+'/',{params});
}

getLpoDetails (lpo_id: string) {
  return this._http.get(BASE_API_URL +'operation/lpo/'  + lpo_id + '/');
}

getLpoView (lpo_id: string) {
  return this._http.get(BASE_API_URL +'operation/lpo/view/'  + lpo_id + '/');
}

editLpo (data: any, lpo_id: string) {
  return this._http.put(BASE_API_URL + 'operation/lpo/' + lpo_id + '/', data);
}

closeLpo(id): Observable<any> {
  return this._http.get(BASE_API_URL + TSAPIRoutes.operation + 'lpo/close/' +id +'/' )
}

deleteLpo(id:string): Observable<any> {
  return this._http.delete(BASE_API_URL+ TSAPIRoutes.operation + 'lpo/'+id+"/");
}

getLpoPdf(id:string): Observable<any> {
  return this._http.get(BASE_API_URL+ TSAPIRoutes.operation + 'lpo/pdf/' + id + "/");
}

getLopListByVendor(id:string): Observable<any> {
  return this._http.get(BASE_API_URL+ TSAPIRoutes.operation + 'lpo/list/' + id + "/");
}
}
