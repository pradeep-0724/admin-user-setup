import { Injectable } from '@angular/core';
import { BehaviorSubject, } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PrivacyPolicyService {

private _privacyPolicySubject=new BehaviorSubject(false);
 $isOpenPrivacyPolicy=this._privacyPolicySubject.asObservable();
 constructor(){

 }

 openPrivacyPolicy(open:boolean) {
  this._privacyPolicySubject.next(open);
}

}
