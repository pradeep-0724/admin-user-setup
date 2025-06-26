import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import { Subject } from 'rxjs';
import { ScreenType, OperationConstants, ScreenConstants } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { OnboadingPermission } from 'src/app/core/services/onboading.service';
import { AuthService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/auth.service';
import { CompanyModuleServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-module-service.service';

@Component({
  selector: 'app-organisation-profile-header-v2',
  templateUrl: './organisation-profile-header-v2.component.html',
  styleUrls: ['./organisation-profile-header-v2.component.scss']
})
export class OrganisationProfileHeaderV2Component implements OnInit {

  companyData: any;
  @Input() companyDetails: Subject<any> = new Subject()
  emailVerificationStatus = '';
  isVerified: boolean;
  emailStatus = '';
  isWaitingState = false; 
  isWitchTenent ='';
  switchTenent='switchTenent';
  companyKey = 'TS_COMPANY_EXISTS';
  userName = 'TS_USER_NAME';
  companyLogoUrl = 'TS_COMPANY_LOGO';
  tsUid = 'TS_UID';
  screenType=ScreenType;
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;



  constructor(
    private _companyModuleService: CompanyModuleServices,
    private _authService: AuthService,
    private _router: Router,
    // private _prefixUrl : PrefixUrlService,
    private _permission :NgxPermissionsService,
    private _onboading:OnboadingPermission,
    private analyitcs: AnalyticsService,

  ) { }

  ngOnInit(): void {
    this.isWitchTenent = localStorage.getItem(this.switchTenent);
    this.getEmailVerificationStatus();
    this.companyDetails.subscribe((data) => {
      this.companyData = data;
      this.getEmailVerificationStatus()
    })
  }

  verifyEmail() {
    let email_address = { email_address: this.companyData?.email_address }
    this._companyModuleService.verifyEmail(email_address).subscribe((response: any) => {
      this.emailStatus = 'Resend Email';
      this.isWaitingState = true
    }, (error) => {
      console.log(error);
    });
  }

  getEmailVerificationStatus() {
    this._companyModuleService.getEmailVeriFicationStatus().subscribe((response: any) => {
      this.emailVerificationStatus = response.result.verification_status;
      if (this.emailVerificationStatus === "Pending") {
        this.isVerified = false;
        this.isWaitingState = true
        this.emailStatus = 'Resend Email';
      }
      if (this.emailVerificationStatus === "Not Verified") {
        this.emailStatus = 'Verify Email';
        this.isVerified = false;
        this.isWaitingState = false
      }
      if (this.emailVerificationStatus === "Verified") {
        this.isVerified = true;
        this.isWaitingState = false;
        this.emailStatus = 'Verified';
      }
    });
  }

  switchTenents(){
    this.analyitcs.addEvent(this.analyticsType.IN,this.analyticsScreen.SWICHTENENT,this.screenType.VIEW,"Navigated");
    localStorage.removeItem(this.switchTenent);
    this._authService.setClientId('');
    localStorage.removeItem(this.userName);
    localStorage.removeItem(this.companyLogoUrl);
    localStorage.removeItem(this.companyKey);
    this._onboading.setIsSuperUserValue(false);
    this._onboading.setOnbodadedValue(false);
    this._permission.loadPermissions([]);
    this._router.navigateByUrl('/client');
  }

  logMeOut() {
    localStorage.removeItem(this.switchTenent);
    this._authService.setClientId('');
    this._authService.logout();
  }

}
