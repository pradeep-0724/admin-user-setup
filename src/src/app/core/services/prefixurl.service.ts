import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class PrefixUrlService {

  constructor(private _authService:AuthService){

  }

 private  prefixUrl ='';
  getprefixUrl(){
    this.prefixUrl ='/client/'+this._authService.getClientId()
    return this.prefixUrl
  }
}

export function getPrefix() {
  return '/client/'+localStorage.getItem('TS_CLIENT_ID');
 }
