import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_API_URL } from './../../../../../core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class ContainerService {  
BASEURL='container/'
  constructor(private _http: HttpClient) {}


  addContainer(data): Observable<any> {
    return this._http.post(BASE_API_URL +this.BASEURL,data);
  }

  getContainer(id): Observable<any> {
    return this._http.get(BASE_API_URL + this.BASEURL+id+"/");
  }

  updateContainer(id,body): Observable<any> {
    return this._http.put(BASE_API_URL + this.BASEURL+id+"/",body);
  }


  getContainerList(params): Observable<any> {
    return this._http.get(BASE_API_URL +this.BASEURL,{params});
  }

  deleteContainer(id:string): Observable<any> {
    return this._http.delete(BASE_API_URL+ this.BASEURL+id+"/");
  }

  getContainerListDetails(): Observable<any> {
    return this._http.get(BASE_API_URL+ this.BASEURL+"dropdown/");
  }
}
