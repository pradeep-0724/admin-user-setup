import { Injectable } from '@angular/core';
import { BehaviorSubject, } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserOnboardingService {
   protected isUserOnBoarded:boolean =true;
   _superUserOnboarding=new BehaviorSubject(false);
   _companyDetailsChanged=new BehaviorSubject(false);
   _isDemoAccount=new BehaviorSubject(false);
   $getNewCompanyDetails=this._companyDetailsChanged.asObservable();
   $showResetButton=this._isDemoAccount.asObservable();
   $isOpenUserOnboardingPopUp=this._superUserOnboarding.asObservable();


 constructor(){

 }

 openUserOnboardingPopUp():boolean {
  this._superUserOnboarding.next(!this.isUserOnBoarded);
  return this.isUserOnBoarded
}

setIsUserOnboarded(isOnboarded:boolean){
  this.isUserOnBoarded =isOnboarded
}

}
