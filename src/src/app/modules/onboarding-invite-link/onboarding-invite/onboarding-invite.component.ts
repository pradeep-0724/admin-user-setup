import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OnboadingPermission } from 'src/app/core/services/onboading.service';
import { AuthService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/auth.service';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { SignUpModuleServices } from '../../customerapp-module/api-services/company-service/signuplink.service';

@Component({
  selector: 'app-onboarding-invite',
  templateUrl: './onboarding-invite.component.html',
  styleUrls: ['./onboarding-invite.component.scss'],
  encapsulation:ViewEncapsulation.Emulated
})
export class OnboardingInviteComponent implements OnInit {

  loginKey = 'TS_LOGIN_TOKEN';
  companyKey = 'TS_COMPANY_EXISTS';
  userName = 'TS_USER_NAME';
  userUuid = 'TS_UID'
  companyLogoUrl = 'TS_COMPANY_LOGO';
  permissions = 'PERMISSIONS'
  token=''
  switchTenent='switchTenent';
constructor(private _tsAuth: AuthService,
  private _router: Router,
  private _activate :SignUpModuleServices,
  private _activatedroute:ActivatedRoute,
  private _onboading:OnboadingPermission ) {
    let loader= document.querySelector('ngx-ui-loader');
   if(loader){
    loader.setAttribute("style", "display:none;");
   }
    this._activatedroute.queryParamMap.subscribe(params => {
      if(isValidValue(params['params']))
        this.token = params['params']['q'];
     });
   }

  ngOnInit() {
    this.getDetails();

  }
  getDetails(){
    this._activate.activateSignup(this.token.trim()).subscribe(data=>{
      this.clearLocalStorage();
      let response=data['result'];
      if (response !== undefined) {
        let tenents=response['tenants'][0]
        this._tsAuth.setClientId(tenents.client_id);
        if(response['is_multi_tenent']){
          localStorage.setItem(this.switchTenent,'true');
        }
        this._onboading.setIsSuperUserValue(tenents.is_super_user);
        this._onboading.setOnbodadedValue(tenents.is_user_onboarded);
        localStorage.setItem(this.loginKey, response.token);
        this._tsAuth.loginToken = response.token;
        if(isValidValue(tenents)) {
          localStorage.setItem(this.companyKey, tenents.company_id);
          localStorage.setItem(this.companyLogoUrl, tenents.logo_url);
        }
        else {
          localStorage.setItem(this.companyKey, '');
          localStorage.setItem(this.companyLogoUrl, '');
        }
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
        localStorage.setItem('TS_CLIENT_ID',tenents.client_id);
        this._router.navigateByUrl('client/'+tenents.client_id+'/overview');
      }
    },(error)=>{
      this.clearLocalStorage();
      this._router.navigateByUrl('/login');
      // if(error.error.message.includes("Invalid activation key")){
      // }
    })
  }

  clearLocalStorage() {
      localStorage.removeItem(this.loginKey);
      localStorage.removeItem(this.companyKey);
      localStorage.removeItem(this.userName);
      localStorage.removeItem(this.userName);
      localStorage.removeItem(this.permissions);
      localStorage.removeItem('TS_CLIENT_ID');
      this._tsAuth.setClientId('');
  }

  ngOnDestroy() {
    let loader= document.querySelector('ngx-ui-loader');
   if(loader){
    loader.setAttribute("style", "display:block;");
   }
  }
}
