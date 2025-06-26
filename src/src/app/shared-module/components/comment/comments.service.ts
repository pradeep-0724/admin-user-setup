import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';


@Injectable({
	providedIn: 'root'
})
export class CommentService {
  constructor(private _http: HttpClient) {
  }

  getComments(key,object_id):Observable<any>{
    return this._http.get(BASE_API_URL+TSAPIRoutes.company_edit+TSAPIRoutes.comment,{params:{key:key,object_id:object_id}})
  }

  postComments(body):Observable<any>{
    return this._http.post(BASE_API_URL+TSAPIRoutes.company_edit+TSAPIRoutes.comment,body)
  }
}
