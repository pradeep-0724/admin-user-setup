import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_API_URL } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class TripApprovalSettingsService {

  constructor( private _http: HttpClient) { }


  getTripApprovals(): Observable<any>{
    return this._http.get(BASE_API_URL+'screen/approval/trip/')
  }

  updateTripApproval(body): Observable<any>{
    return this._http.post(BASE_API_URL+'screen/approval/trip/',body)
  }


  getTripTimeSheetApprovals(): Observable<any>{
    return this._http.get(BASE_API_URL+'screen/approval/triptimesheet/')
  }

  updateTripTimeSheetApproval(body): Observable<any>{
    return this._http.post(BASE_API_URL+'screen/approval/triptimesheet/',body)
  }
}
