import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_API_URL } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class QuotationSettingsService {

  constructor( private _http: HttpClient) { }


  getValidations(): Observable<any>{
    return this._http.get(BASE_API_URL+'validations/quotation/')
  }

  getApprovals(): Observable<any>{
    return this._http.get(BASE_API_URL+'screen/approval/quotation/')
  }

  updateApproval(body): Observable<any>{
    return this._http.post(BASE_API_URL+'screen/approval/quotation/',body)
  }
}
