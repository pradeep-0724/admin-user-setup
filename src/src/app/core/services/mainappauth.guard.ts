import { PrivacyPolicyService } from './privacy-policy-service';
import { AddressLengthService } from './addresslength.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { CurrencyService } from './currency.service';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CommonService } from './common.service';
import { of } from 'rxjs';
import { OnboadingPermission } from './onboading.service';
import { TaxService } from './tax.service';
import { TerminologiesService } from './terminologies.service';
import { MaterialService } from './material.service';
import {CountryIdService } from './countryid.service';
import { UserOnboardingService } from './super-user-onboarding.service';
import { TrailPeriodService } from './trail-period.service';
import { CreateVehicleService } from './create-vehicle.service';
import { PhoneCodesFlagService } from './phone-code_flag.service';
import { FinancialYearService } from './financial-year.service';

@Injectable({
  providedIn: 'root'
})

export class MainAppAuthGaurd implements CanActivate {
  clientId = 'TS_CLIENT_ID';
  quotationVersion='QUOTATION_VERSION';
  TIME_ZONE='timezone'

  constructor(private router: Router,
    private commonService:CommonService,
    private permissionsService: NgxPermissionsService,
    private _onboading :OnboadingPermission,private _tax:TaxService, private _material: MaterialService,
    private _terminology :TerminologiesService,
    private _currency:CurrencyService,
    private _countryId:CountryIdService,
    private _addressLength:AddressLengthService,
    private _privacyPolicy:PrivacyPolicyService,
    private _userCompanyOnboarded:UserOnboardingService,
    private _trailPeriod:TrailPeriodService,
    private _createVehicleService:CreateVehicleService,
    private _phone_codes_flag_service:PhoneCodesFlagService,
    private _financialYearService:FinancialYearService

    ) {
  }

   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>  {
    if (localStorage.getItem(this.clientId)) {
    return this.commonService.getPermission().pipe(
     map(data=>{
        this._onboading.setIsSuperUserValue(data['result'].is_super_user);
        this._onboading.setOnbodadedValue(data['result'].is_user_onboarded);
        this._privacyPolicy.openPrivacyPolicy(data['result'].is_super_user&&data['result'].is_user_onboarded && !data['result'].accepted_aggrement);
        this._currency.setCurrency(data['result'].currency);
        this._tax.setTax(data['result'].is_taxable);
        this._tax.setVat(data['result'].is_VAT);
        this._tax.setPos(data['result'].is_pos);
        this._tax.setIban(data['result'].is_iban);
        localStorage.setItem(this.TIME_ZONE,data['result'].timezone)
        this._phone_codes_flag_service.phoneCodesFlag ={code:data['result'].phone_code,flag:data['result'].flag_url}
        this._material.setMaterial(data['result'].add_material_condition);
        this._terminology.terminologie =data['result'].terminologies;
        this._countryId.setCountryId(data['result'].country_id);
        this._addressLength.adressLength = data['result'].address_length;
        this._userCompanyOnboarded.setIsUserOnboarded(data['result'].is_company_onboarded)
        this._userCompanyOnboarded._isDemoAccount.next(data['result'].is_resettable);
        this._createVehicleService.createVehicle=data['result'].can_create_vehicle;
        this._createVehicleService.createAsset=data['result'].can_create_asset;
        localStorage.setItem(this.quotationVersion,data['result'].show_old_quotation)
        data['result'].subscription_details['is_accessible']= data['result'].is_accessible
        this._trailPeriod.isTrailPeriodOverPopUp(data['result'].subscription_details)
        this._financialYearService.financialYear={start:data['result']['from_financial_month'],end:data['result']['to_financial_month']}
        let permissions=[];
        permissions = data['result'].permissions;
        if(permissions.length==1 && permissions[0]=='gps__view'){
        }else{
          permissions.push('overview')
        }
        if(data['result']['show_bdp']){
          permissions.push('bdp_user');
        }
        if(data['result'].is_super_user){
          permissions.push('super_user');
          this.permissionsService.loadPermissions(permissions);
        }else{
          this.permissionsService.loadPermissions(permissions);
        }
       return true
     })
    )
    } else {
      this.router.navigate(['/login']);
      let falseObj= of(false)
      return falseObj.pipe(map(data=>{
         return data
      }))

    }
  }

}
