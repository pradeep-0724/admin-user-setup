import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_API_URL } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class ContainerReportService {

  constructor(private _http:HttpClient) { }


  getContainerReport(params):Observable<any>{
    return this._http.get(BASE_API_URL + 'revenue/workorder/container/report/',{params});
  }
}
