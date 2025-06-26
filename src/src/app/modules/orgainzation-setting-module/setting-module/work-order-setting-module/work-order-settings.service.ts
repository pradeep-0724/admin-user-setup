import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_API_URL } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderSettingsService {
  constructor( private _http: HttpClient) { }


  getValidations(): Observable<any>{
    return this._http.get(BASE_API_URL+'validations/workorder/')
  }

  getApprovals(): Observable<any>{
    return this._http.get(BASE_API_URL+'screen/approval/workorder/')
  }

  updateApproval(body): Observable<any>{
    return this._http.post(BASE_API_URL+'screen/approval/workorder/',body)
  }
}
