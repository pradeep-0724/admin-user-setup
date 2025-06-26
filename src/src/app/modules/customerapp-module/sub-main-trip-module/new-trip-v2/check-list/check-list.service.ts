import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {TSAPIRoutes, BASE_API_URL} from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class CheckListService {

 protected checkListData=[];

  constructor(
    private _httpService: HttpClient
  ) { }

 
set checkList(val:Array<any>){
  this.checkListData= val
}

get checkList(){
 return this.checkListData
}


  getCheckList(): Observable<any> {
    return this._httpService.get(BASE_API_URL+TSAPIRoutes.revenue+'formfield/trip/path/');
  }

  postCheckList(body): Observable<any> {
    return this._httpService.post(BASE_API_URL+TSAPIRoutes.revenue+'formfield/trip/path/',body);
  }
}
