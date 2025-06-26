import { getPrefix } from 'src/app/core/services/prefixurl.service';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { UserOnboardingService } from './super-user-onboarding.service';

@Injectable({
  providedIn: 'root'
})

export class UserOnBoardingAuthGaurd implements CanActivate {

  constructor( private _UserOnboardingService:UserOnboardingService,private _roue:Router
    ) {
  }

   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
     let isUserOnBoarded=this._UserOnboardingService.openUserOnboardingPopUp();
     if(isUserOnBoarded)
     return true;
     else{
      this._roue.navigateByUrl(getPrefix()+'/overview')
      return false
     }

  }

}

