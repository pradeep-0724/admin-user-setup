import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CountryIdService {
  private countryId=''
  setCountryId(countryId:string){
    this.countryId=countryId
  }
  getCountryId():string{
    return this.countryId
  }
}
