import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, } from 'rxjs';
import { BASE_API_URL } from '../constants/api-urls.constants';

@Injectable({
    providedIn: 'root'
})
export class TrailPeriodService {
 protected subscription_details={
  is_accessible:false,
  trial_period_ended:false,
  remaining_days:0
  }
   _isTrailPeriod=new BehaviorSubject(this.subscription_details);
   $openTrailPeriodWarning=this._isTrailPeriod.asObservable();

 constructor(private _http: HttpClient){

 }

isTrailPeriodOverPopUp(subscription_details){
  this.subscription_details =subscription_details;
  this._isTrailPeriod.next(this.subscription_details);
}

contactUs():Observable<any>{
  return this._http.get(BASE_API_URL+'renewal/contactus/')
}

}
