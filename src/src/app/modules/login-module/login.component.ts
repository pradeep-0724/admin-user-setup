
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/auth.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators, AbstractControl, UntypedFormArray, UntypedFormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { NgxPermissionsService } from 'ngx-permissions';
import { OnboadingPermission } from 'src/app/core/services/onboading.service';
import { HttpClient } from '@angular/common/http';
import { BASE_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.scss'
  ]
})
export class LoginComponent implements OnInit {
  loginForm: UntypedFormGroup;
  invalidCred: Boolean = false;
  formNotValid: Boolean = false;
  returnUrl: string;
  isAggrementAccpeted: boolean = false;
  alreadyAccpetedAggrement: boolean = false;
  showErrorMessage: boolean = false;
  loginKey = 'TS_LOGIN_TOKEN';
  token ='';
  companyKey = 'TS_COMPANY_EXISTS';
  userName = 'TS_USER_NAME';
  userUuid = 'TS_UID'
  companyLogoUrl = 'TS_COMPANY_LOGO';
  clientId :string =''
  loginToken ='';
  popupInputData = {
    'msg': 'Max 1 login session per user is allowed',
    'type': 'login-warning',
    'show': false
  }

  constructor(
    private _tsAuth: AuthService,
    private _router: Router,
    private _fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private _permission:NgxPermissionsService,
    private  _onboading:OnboadingPermission,
    private _http: HttpClient
  ) { }

  ngOnInit() {
    this.buildForm();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'client';
    if (this._tsAuth.isLoggedIn()) {
      this._router.navigateByUrl(this.returnUrl);
    }
  }

  buildForm() {
    this.loginForm = this._fb.group({
      username: [
        '',
        Validators.required
      ],
      password: [
        '',
        Validators.required
      ],
      app_access: "main_portal"
    });
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  setAsTouched(group: UntypedFormGroup | UntypedFormArray) {
    group.markAsTouched();
    for (let i in group.controls) {
      if (group.controls[i] instanceof UntypedFormControl) {
        group.controls[i].markAsTouched();
      } else {
        this.setAsTouched(group.controls[i]);
      }
    }
  }

  submitLoginForm() {
    if (this.loginForm.valid) {
      let localStorageToken =  localStorage.getItem(this.loginKey);
      if(localStorageToken){
        this._http.post(BASE_URL + TSAPIRoutes.logout, {}).subscribe(() => {
         this.clearLocalStorage();
         this.callLogIn();
        });
      }else{
       this.callLogIn();
      }
    } else {
      this.setAsTouched(this.loginForm);
      this.formNotValid = true;
    }
  }

  confirmButton(e) {
    if(e.loginUsingOtherCredentials){
       this._tsAuth.logout();
       return
    }

    if(e.logoutOfOtherDevices){
      this._tsAuth.getTokenRegister().subscribe(data=>{
       if(data['result']=="Token Registered"){
        this._tsAuth.token = this.token;
         localStorage.setItem(this.loginKey,this.token );
         this._router.navigateByUrl(this.returnUrl);
       }
      });
    }
  }

  clearLocalStorage(){
      localStorage.removeItem(this.userName);
      localStorage.removeItem(this.userUuid);
      localStorage.removeItem(this.companyLogoUrl);
      localStorage.removeItem(this.loginKey);
      localStorage.removeItem(this.companyKey);
      this._onboading.setIsSuperUserValue(false);
      this._onboading.setOnbodadedValue(false);
      this._permission.loadPermissions([]);
      this._tsAuth.token ='';
  }

  callLogIn(){
    this._tsAuth.login(this.loginForm.value).subscribe(
      (response) => {
        this.token = response.token;
        this._tsAuth.setToken(this.token)
        if(response.other_device_logged_in){
          this.popupInputData.show= true;
        }else{
          localStorage.setItem(this.loginKey,this.token );
         this._router.navigateByUrl(this.returnUrl);
        }
      },
      (error) => {
        if(error.error.hasOwnProperty('detail') && error.error.detail.includes("Unable to log in with provided credentials."))
        this.invalidCred = true;
      }
    );
  }
}
