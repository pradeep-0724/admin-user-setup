import {  NgxPermissionsService } from 'ngx-permissions';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TSAPIRoutes, BASE_URL, BASE_API_URL } from '../../../../core/constants/api-urls.constants';
import { TSRouterLinks } from '../../../../core/constants/router.constants';
import { map } from 'rxjs/operators';
import { isValidValue } from '../../../../shared-module/utilities/helper-utils';
import { OnboadingPermission } from '../../../../core/services/onboading.service';
import { AnalyticsService } from '../../../../core/services/analytics.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';


@Injectable({
	providedIn: 'root'
})
export class AuthService {
	loginKey = 'TS_LOGIN_TOKEN';
  companyKey = 'TS_COMPANY_EXISTS';
  userName = 'TS_USER_NAME';
  userUuid = 'TS_UID'
  companyLogoUrl = 'TS_COMPANY_LOGO';
  clientId :string =''
  token ='';
  loginToken ='';
  constructor(private _http: HttpClient, private _router: Router,private _permission:NgxPermissionsService,private _analytics:AnalyticsService,
    private  _onboading:OnboadingPermission,private apiHandler:ApiHandlerService) {
  }


	login(loginCredentials: any): Observable<any> {
		return this._http.post(BASE_URL + TSAPIRoutes.login, loginCredentials).pipe(
			map((response: any) => {
				if (response !== undefined) {
          this._onboading.setOnbodadedValue(response.is_onboarded);
          if(isValidValue(response.user)) {
            if(response.user.username)
              localStorage.setItem(this.userName,response.user.username );
            if(response.user.pk)
              localStorage.setItem(this.userUuid,response.user.pk);
          }
          else {
            localStorage.setItem(this.userName,'' );
            localStorage.setItem(this.userUuid,'' );
          }
				}
				return response;
			})
		);
	}

	logout() {
    this.apiHandler.handleRequest(this._http.post(BASE_URL + TSAPIRoutes.logout, {}),'Logged Out Successfully!').subscribe({
      next:(resp)=>{
        this._analytics.analitycsLoggedOut();
        localStorage.removeItem(this.userName);
        localStorage.removeItem(this.userUuid);
        localStorage.removeItem(this.companyLogoUrl);
        localStorage.removeItem(this.loginKey);
        localStorage.removeItem(this.companyKey);
        localStorage.removeItem('TS_CLIENT_ID');
        this._onboading.setIsSuperUserValue(false);
        this._onboading.setOnbodadedValue(false);
        this._permission.loadPermissions([]);
        this.token ='';
        this._router.navigateByUrl('/' + TSRouterLinks.login);
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }

	isLoggedIn() {
		const authToken = localStorage.getItem(this.loginKey);
		if (authToken !== null && authToken !== undefined && authToken !== '' && authToken !== 'undefined') {
        return true
		}
		return false;
  }


  postAcceptAggrement(): Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.tenant_aggrement, {});
  }

	getToken() {
		let  authToken = localStorage.getItem(this.loginKey);
    if(authToken ==null||authToken=='null'){
      authToken = this.token;
      this.loginToken = this.token;
    }
		if (authToken !== null && authToken !== undefined && authToken !== '' && authToken !== 'undefined') {
			return authToken;
		}
		return '';
  }

  getUserName() {
    const userName = localStorage.getItem(this.userName);
		if (userName !== null && userName !== undefined && userName !== '' && userName !== 'undefined') {
			return userName;
		}
		return '';
  }

  getUserUuid() {
    const userUuid = localStorage.getItem(this.userUuid);
		if (userUuid !== null && userUuid !== undefined && userUuid !== '' && userUuid !== 'undefined') {
			return userUuid;
		}
		return '';
  }

  getCompanyLogoUrl() {
    const companyUrl = localStorage.getItem(this.companyLogoUrl);
		if (companyUrl !== null && companyUrl !== undefined && companyUrl !== '' && companyUrl !== 'undefined') {
			return companyUrl;
		}
		return '../../../../assets/img/dummy-user.jpeg';
  }

  getDetailsByToken(request: any): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.signup, {params: request});
  }

  onSignup(request:any,params:any) {
    return this._http.post(BASE_API_URL + TSAPIRoutes.signup, request, {params: params});
  }

  changePassword(request:any) {
    return this._http.put(BASE_API_URL + TSAPIRoutes.reset_password, request);
  }

  resetPassword(request:any) {
    return this._http.post(BASE_API_URL + TSAPIRoutes.reset_password, request);
  }

  sendResetPasswordLinkToEmail(request:any) {
    return this._http.post(BASE_API_URL + TSAPIRoutes.reset_password + 'email/link/', request);
  }

  getTokenRegister(){
    return this._http.get(BASE_API_URL + TSAPIRoutes.user_token_register);
  }

  setClientId(id){
    this.clientId =id;
  }

  setToken(token){
    this.token = token;
   }



  getClientId(){
   if(localStorage.getItem('TS_CLIENT_ID'))
   {
    return localStorage.getItem('TS_CLIENT_ID');
   }
   else{
    return this.clientId
  }
  }
}


