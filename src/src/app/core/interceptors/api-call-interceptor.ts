import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/auth.service';
import { Router } from '@angular/router';
import { TokenExpireService } from '../services/token-expire.service';
import { OnboadingPermission } from '../services/onboading.service';
import { TSRouterLinks } from '../constants/router.constants';

@Injectable()
export class ApiCallInterceptor implements HttpInterceptor {
    clientId = 'TS_CLIENT_ID';
    switchTenent = 'switchTenent';
    loginKey = 'TS_LOGIN_TOKEN';
    companyKey = 'TS_COMPANY_EXISTS';
    userName = 'TS_USER_NAME';
    userUuid = 'TS_UID'
    companyLogoUrl = 'TS_COMPANY_LOGO';
    token = '';
    loginToken = '';
    quotationversion='QUOTATION_VERSION'
    companyName='companyName'
    timezone='timezone'


    constructor(
        private _authService: AuthService,
        private _router: Router,
        private _tokenExpireService: TokenExpireService,
        private  _onboading:OnboadingPermission
    ) {
    
    }


    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        let updatedRequest = request.clone({
            headers: request.headers.set('x-client-id', `${this.getClientId()}`)
        });

        const authToken = this.getAuthToken();
        if (authToken) {
            updatedRequest = updatedRequest.clone({
                headers: updatedRequest.headers.set('Authorization', authToken)
            });
        }

        return next.handle(updatedRequest).pipe(
            tap(
                event => {
                    this._tokenExpireService.isTokenExpire.next(false);
                },
                error => {
                    if (error.status === 401) {
                        this.handleUnauthorizedError(error);
                    }
                }
            )
        );
    }

    private handleUnauthorizedError(error: any) {
        this._tokenExpireService.isTokenExpire.next(true);
        this.clearLocalStorage();
        this._onboading.setIsSuperUserValue(false);
        this._onboading.setOnbodadedValue(false);
        this.token = '';
        this._router.navigateByUrl('/' + TSRouterLinks.login);
        location.reload();
    }

    private clearLocalStorage() {
        const keys = [
            this.userName,
            this.userUuid,
            this.companyLogoUrl,
            this.loginKey,
            this.companyKey,
            this.quotationversion,
            this.companyName,
            this.timezone,
            this.clientId
        ];
        keys.forEach(key => localStorage.removeItem(key));
    }

    getAuthToken() {
        return this._authService.getToken() !== '' ? ('JWT ' + this._authService.getToken()) : '';
    }

    getClientId() {
        return this._authService.getClientId();
    }
}
