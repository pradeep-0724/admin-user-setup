import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { CommonService } from 'src/app/core/services/common.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { TripService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/trip-services/trip.service';
import { PartySettingService } from 'src/app/modules/orgainzation-setting-module/setting-module/party-setting-module/party-setting.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { getBlankOption, roundOffAmount } from 'src/app/shared-module/utilities/helper-utils';

@Component({
  selector: 'app-party-balance-billing',
  templateUrl: './party-balance-billing.component.html',
  styleUrls: ['./party-balance-billing.component.scss']
})
export class PartyBalanceBillingComponent implements OnInit,AfterViewInit {
  @Input() balanceBilling:FormGroup;
  @Input() editData?:Observable<any>
  @Input()isClient=false;
  partyId=''
  accountList=[];
  paymentTerm=[];
  initialValues = {
		paymentMethod: {},
		terms: {},
    paymentMode : getBlankOption()
	};
  currency_type:any;
  opening_balance_present=false;
  accountType = new ValidationConstants().accountType.join(',');
  isEdit=false;
  termsCustom="394a0453-fc2d-40ff-918f-aeb62201a161";
  paymentMode = [
    {
      label : '',
      value : 0
    },
    {
      label : 'Bank Transfer',
      value : 1
    },
    {
      label : 'Cheque',
      value : 2
    },
    {
      label : 'Cash',
      value : 3
    },
  ]
  constructor(private _activeRoute: ActivatedRoute,	private currency: CurrencyService,private _tripService: TripService,private __commonService:CommonService ,private _partySettingService: PartySettingService   ) { }

  ngOnInit(): void {
  
    this._tripService.getAccounts({ q: this.accountType }).subscribe((response: any) => {
			this.accountList = response.result;
		});
    this.__commonService.getStaticOptions('payment-term').subscribe((response: any) => {
			this.paymentTerm = response.result['payment-term'];
		});
    this.currency_type = this.currency.getCurrency();
    this.getOpeningBalanceDate();
    if(this.editData){
      this.editData.subscribe(data=>{
        this.isEdit =true;
        this.patchPartyBilling(data);
      })
    }
  }

  ngAfterViewInit(): void {
    this._activeRoute.params.subscribe((params: any) => {
      if(!params['party_id']){
        this._partySettingService.getPartySettings().subscribe(res => {
          this.balanceBilling.patchValue({
            credit_limit: res['result'].default_credit_limit,
            grace_period: res['result'].default_grace_limit,
            kyc: res['result'].default_kyc,
          })
        })
      }
		
		});
  }
  changeKyc(){
    this.balanceBilling.get('kyc').setValue(!this.balanceBilling.get('kyc').value)
  }


	addErrorClass(controlName: AbstractControl) {
		return TransportValidator.addErrorClass(controlName);
	}

  roundOffValue(formControl) {
		roundOffAmount(formControl);
	}

  getOpeningBalanceDate(){
		this.__commonService.getOpeningBalanceStatus().subscribe((response: any) => {
			if (response.result.present) {
        this.opening_balance_present = true;
        this.balanceBilling.get('opening_balance_date').setValue(response.result.date)
			}
		});
	}

  patchPartyBilling(data){
   let billingData= data['balance_billing'];
   if(billingData['billing_payment_method']){
   this.initialValues.paymentMethod={label:billingData['billing_payment_method']['payment_method'],value:''}
   this.balanceBilling.get('billing_payment_method').setValue(billingData['billing_payment_method']['id'])
   }
   if(billingData['terms']){
    this.initialValues.terms={label:billingData['terms']['label'],value:''}
    this.balanceBilling.get('terms').setValue(billingData['terms']['id'])
   }
   if(billingData['payment_mode']){
    let paymentMode = this.paymentMode.find((ele)=>ele.value === billingData['payment_mode']);
    if(paymentMode){
      this.initialValues.paymentMode.label= paymentMode['label'];
      this.initialValues.paymentMode.value= paymentMode['value']; 
    }
    
   }
   this.balanceBilling.get('grace_period').setValue(billingData['grace_period'])
   this.balanceBilling.get('terms_days').setValue(billingData['terms_days']);
   this.balanceBilling.get('payment_mode').setValue(billingData['payment_mode']);

  }

  onChangepaymentTerm(){
    this.balanceBilling.get('terms_days').setValue(0)
  }

}
