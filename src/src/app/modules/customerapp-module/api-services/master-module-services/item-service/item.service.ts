import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'any'
})
export class ItemMasterService {

  constructor(
    private _http: HttpClient
  ) { }



  postItemDetails(itemdata: any): Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.item, itemdata);
  }
  getItemDetails(id: any): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.item+id+'/');
  }
  putItemDetails(id,itemdata: any): Observable<any> {
    return this._http.put(BASE_API_URL + TSAPIRoutes.item+id+'/', itemdata);
  }
  getItemsList(params?:any) {
    return this._http.get(BASE_API_URL + TSAPIRoutes.item, {params : params});
  }
  deleteItem(Id: String): Observable<any> {
    return this._http.delete(BASE_API_URL +TSAPIRoutes.item+Id+'/');
  }

}
