import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { TSAPIRoutes, BASE_API_URL } from 'src/app/core/constants/api-urls.constants';

@Injectable({
	providedIn: 'root'
})
export class CompanyModuleServices {

 isOpen= new BehaviorSubject(false);
  constructor(private _http: HttpClient) {}

  getCountry(isall=false):Observable<any>{
    return this._http.get(BASE_API_URL + 'country/',{params:{'onboarding':isall}})
  }
  getCurrency():Observable<any>{
    return this._http.get(BASE_API_URL + 'currency/')
  }
  getTimezone():Observable<any>{
    return this._http.get(BASE_API_URL + 'timezone/')
  }
  getStates(id):Observable<any>{
    return this._http.get(BASE_API_URL + 'country/'+id+'/states/')
  }
  getPhoneCode():Observable<any>{
    return this._http.get(BASE_API_URL + 'phonecode/');
  }

  postUser(body,id):Observable<any>{
    return this._http.put(BASE_API_URL + 'user/'+id+'/',body)
  }

  getUser(id):Observable<any>{
    return this._http.get(BASE_API_URL + 'user/'+id+'/')
  }

  getActiveUsers():Observable<any>{
    return this._http.get(BASE_API_URL + 'company/user/active/')
  }

  checkUserName(userId, username): Observable<any> {
    return this._http.get(BASE_API_URL + 'user/'  + userId + '/validate/username/?q=' + username)
  }

  checkPrimaryMobileNumber(userId, phoneCode, phone): Observable<any> {
    return this._http.get(BASE_API_URL + 'user/'  + userId + '/validate/phone/', {params: {phone_code: phoneCode, phone: phone}})
  }

  postUserPassword(id,body){
    return this._http.post(BASE_API_URL + 'user/'+id+'/password/',body)
  }

  isUniqueEmailObservable(value): Observable<any> {
       return this._http.get(BASE_API_URL + TSAPIRoutes.company_email_unique_email+ value);
   }
   verifyEmail(email_address) :Observable<any>{
       return  this._http.post(BASE_API_URL + TSAPIRoutes.company_add+TSAPIRoutes.verify_email,email_address);
     }
   getEmailVeriFicationStatus():Observable<any>{
       return  this._http.get(BASE_API_URL + TSAPIRoutes.company_add+TSAPIRoutes.email_verification_status);
    }
}
