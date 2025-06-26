import { Injectable } from '@angular/core';
type codeFlag={
  code:string,
  flag:string
}

@Injectable({
    providedIn: 'root'
})
export class PhoneCodesFlagService {
  private phone_codes_flag:codeFlag;
  set phoneCodesFlag(phone_codes:codeFlag){
    this.phone_codes_flag=phone_codes
  }
  get phoneCodesFlag():codeFlag{
    return this.phone_codes_flag
  }
}
