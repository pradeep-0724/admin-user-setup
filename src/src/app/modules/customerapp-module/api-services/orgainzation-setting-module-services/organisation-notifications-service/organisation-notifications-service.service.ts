import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TSAPIRoutes, BASE_API_URL } from 'src/app/core/constants/api-urls.constants';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class OrganisationNotificationService {

    constructor(private _http: HttpClient) { }

	getNotificationDetails(): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.company_add + TSAPIRoutes.setting + TSAPIRoutes.notification);
	}

    postNotificationDetails(data): Observable<any> {
		return this._http.post(BASE_API_URL + TSAPIRoutes.company_add + TSAPIRoutes.setting + TSAPIRoutes.notification,data);
	}


	verifyEmailOTP(data): Observable<any> {
		return this._http.post(BASE_API_URL + TSAPIRoutes.company_add +  'setting/' + TSAPIRoutes.notification +TSAPIRoutes.verify_email_otp , data)
	}

	sendVerificationCode(data) :Observable<any> {
		return this._http.post(BASE_API_URL + TSAPIRoutes.company_add +  'setting/' + TSAPIRoutes.notification + TSAPIRoutes.verify_email_otp + 'send/', data)
	}




}
