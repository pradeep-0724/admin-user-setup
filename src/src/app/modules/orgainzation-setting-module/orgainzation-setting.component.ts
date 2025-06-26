import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subscription, BehaviorSubject, interval, Observable } from 'rxjs';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { OnboadingPermission } from 'src/app/core/services/onboading.service';
import { PrivacyPolicyService } from 'src/app/core/services/privacy-policy-service';
import { UserOnboardingService } from 'src/app/core/services/super-user-onboarding.service';
import { AuthService } from '../customerapp-module/api-services/auth-and-general-services/auth.service';
import { ConsoleLogService } from '../customerapp-module/api-services/auth-and-general-services/console-log.service';

@Component({
  selector: 'app-orgainzation-setting',
  templateUrl: './orgainzation-setting.component.html',
  styleUrls: ['./orgainzation-setting.component.scss']
})
export class OrgainzationSettingComponent implements OnInit ,AfterViewInit {
  isOnboaded = false;
  alivenessSub$: Subscription;
  tokenCheckSub$: Subscription;
  routeChange = new BehaviorSubject(false);
  TS_LOGIN_TOKEN = 'TS_LOGIN_TOKEN';
  targetElement: Element;
  eventTypeScroll = false;
  collapsed: boolean = false;
  isnewNavigation= new BehaviorSubject(true);
  popupInputData = {
    'msg': 'We have detected more than one active logged in session for the current user, Hence logging you out. Please Note: Max 1 login session per user is allowed',
    'type': 'error',
    'show': false
  }
  show=false;
  isDemoAccount=false;
  mobileView = false;

  constructor(private _onboading: OnboadingPermission, private _http: HttpClient,private _uesrOnboarding: UserOnboardingService,

    private _route: Router, private _tsAuth: AuthService, private _consoleLog:ConsoleLogService,private _privacyPolicy:PrivacyPolicyService, private _isMobile:DeviceDetectorService
  ) {
    this.isOnboaded = this._onboading.getOnbodadedValue();
  }
  onActivate(_event: any): void {
    this.routeChange.next(true);
    this.isOnboaded = this._onboading.getOnbodadedValue()
    const main_content= document.getElementById('main-content')
    main_content.scrollTo({
      top: 0,
      behavior: 'smooth' 
    });
  }
  ngAfterViewInit(): void {
  }
  ngOnInit(): void {
    this._consoleLog.disableConsoleInProduction();
    if (!this.isOnboaded) {
      this._route.navigateByUrl('/404');
    }
    this.intervalCount();
    this.sendToLogin();
    this.targetElement = document.getElementById('main-content');
    this._privacyPolicy.$isOpenPrivacyPolicy.subscribe(isopen=>{
      this.show =isopen;
    });
    this._uesrOnboarding.$showResetButton.subscribe(data=>{
      this.isDemoAccount=data;
    });
    if(this._isMobile.deviceType!='desktop'){
      this.mobileView = true;


    }
  }

  intervalCount() {
    let intervalC = interval(5000);
    this.alivenessSub$ = intervalC.subscribe(data => {
      this.callAlivenessApi().subscribe(response => {
        if (response['result'] == 'death') {
          this.popupInputData.show = true;
          setTimeout(() => {
            if (this.popupInputData.show) {
              this.confirmButton(true);
            }
          }, 10000);
        }
      })

    });
  }
  callAlivenessApi(): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.user_aliveness)
  }

  confirmButton(e) {
    if (e) {
      this.popupInputData.show = false;
      this._tsAuth.logout();
    }
  }



  sendToLogin() {
    let intervalc = interval(1000);
    this.tokenCheckSub$ = intervalc.subscribe(intr => {
      let token =''
      token= localStorage.getItem(this.TS_LOGIN_TOKEN);
      if (token==''|| token ==undefined) {
        this._tsAuth.logout();
      }
    })
  }


  ngOnDestroy(): void {
    this.alivenessSub$.unsubscribe();
    this.tokenCheckSub$.unsubscribe();
  }
}