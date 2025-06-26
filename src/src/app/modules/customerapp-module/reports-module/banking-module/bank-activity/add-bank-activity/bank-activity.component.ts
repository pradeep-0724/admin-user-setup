import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormArray, AbstractControl, Validators, UntypedFormControl } from '@angular/forms';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { TripService } from '../../../../api-services/revenue-module-service/trip-services/trip.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { CommonService } from 'src/app/core/services/common.service';
import { BankingService } from '../../../../api-services/reports-module-services/banking-service/banking.service';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { Router } from '@angular/router';
import { getObjectFromList, isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { clone } from 'lodash';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { EmployeeService } from 'src/app/modules/customerapp-module/api-services/master-module-services/employee-service/employee-service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';



@Component({
  selector: 'app-bank-activity',
  templateUrl: './bank-activity.component.html',
  styleUrls: ['./bank-activity.component.scss']
})
export class BankActivityComponent implements OnInit {
  addBankActivityForm : UntypedFormGroup;
  employeeList: any = [];
  dateToday : any;
  accountList: Array<any> = [];
  accountdepositList: Array<any> = [];
  accountWithdrawlList : Array<any> = [];
  accountType = new ValidationConstants().accountType.join(',');
  initialDetails = {
    depositedIn : [],
    withdrawlFrom : []
  }
  apiError: string;
  currency_type;
  prefixUrl: string;
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;
  screenType=ScreenType;

  constructor(private _fb: UntypedFormBuilder,
    private _commonService: CommonService,
    private _tripService: TripService,
    private _employeeService: EmployeeService,
    private _analytics:AnalyticsService,
    private _router: Router,
    private currency:CurrencyService,
    private bankService: BankingService,
    private _prefixUrl:PrefixUrlService) {
     }

  ngOnInit() {
     setTimeout(() => {
      this.prefixUrl = this._prefixUrl.getprefixUrl();
      this.currency_type = this.currency.getCurrency();
    }, 1000);
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.BANKACTIVITY,this.screenType.ADD,"Navigated");
    this.buildForm();
    this.getAllEmployees();
    this.getAccountsList();
    this.getSuggestedBankActivityNo(new ValidationConstants().keybankActivity);
    this.dateToday = new Date(dateWithTimeZone());
    this.addBankActivityForm.controls['date'].setValue(new Date(dateWithTimeZone()));


  }

  buildForm() {
    this.addBankActivityForm = this._fb.group({
      employee: [null],
      date: [  null,
        [Validators.required]],
      description: [null],
      activities: this._fb.array([]),
  });
  this.buildActivities([
    {}
  ]);
}

buildActivities(items: any[]) {
  const activities = this.addBankActivityForm.controls['activities'] as UntypedFormArray;
  items.forEach((item) => {
    activities.push(this.addActivity(item));
  });
}

addActivity(item: any) {
  const form = this._fb.group({
    transaction_date: [
       null,
      [Validators.required]
    ],
    reference_number: [
      null
    ],
    bank_activity_number: [
      null,
      [Validators.required]
    ],
    deposited_in: [
      null,
      [Validators.required]
    ],
    withdrawl_from: [
      null,
      [Validators.required]
    ],
    amount: [
      0,
      [Validators.required,Validators.min(0.01)]
    ]
  });
  return form;
}

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  clearActivities() {
    const activities = this.addBankActivityForm.controls['activities'] as UntypedFormArray;
    let resetArray = [];
    activities.controls.forEach((act) => {
      let resetObj = {
        bank_activity_number : act.get('bank_activity_number').value,
        transaction_date : null,
        reference_number : null,
        deposited_in : null,
        withdrawl_from : null,
        amount : 0
      }
      resetArray.push(resetObj);
    });
    activities.reset(resetArray);
    this.emptyActivitiesDropdowns();
    this.emptyAccounts();
    activities.controls.forEach(act => {
      this.initialDetails.depositedIn.push({ label: '' });
      this.initialDetails.withdrawlFrom.push({ label: '' });
      this.accountWithdrawlList.push(this.accountList);
      this.accountdepositList.push(this.accountList);
    });
  }

  removeActivity(index) {
    (this.addBankActivityForm.controls['activities'] as UntypedFormArray).removeAt(index);
    this.initialDetails.depositedIn.splice(index,1);
    this.initialDetails.withdrawlFrom.splice(index,1);
    this.accountWithdrawlList.splice(index,1);
    this.accountdepositList.splice(index,1);
  }

  addMoreActivity() {
    const activities = this.addBankActivityForm.controls['activities'] as UntypedFormArray;
    const activityForm = this.addActivity({});
    activities.push(activityForm);
    this.setSuggestedBankactivityNo();
    this.accountWithdrawlList.push(this.accountList);
    this.accountdepositList.push(this.accountList);
  }

  getAllEmployees() {
    this._employeeService.getEmployeeList().subscribe((response) => {
      if(response && response.length>0) {
        this.employeeList = response;
      }
    });
  }

  saveBankActivity() {
    const form = this.addBankActivityForm ;
    form.get('date').patchValue(changeDateToServerFormat(form.get('date').value));
    const activities = this.addBankActivityForm.controls['activities'] as UntypedFormArray;
    activities.controls.forEach(act =>{
      act.get('transaction_date').patchValue(changeDateToServerFormat(act.get('transaction_date').value));
    })
    if(form.valid) {
      this.createBankActivity(form.value);
    }
    else {
      this.setAsTouched(form);
    }
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

  createBankActivity(request) {
    this.apiError = '';
    this.bankService.createNewBankActivity(request).subscribe(

      res =>{
        this._analytics.addEvent(this.analyticsType.CREATED,this.analyticsScreen.BANKACTIVITY)
        this._router.navigateByUrl( this.prefixUrl+ '/' +
          TSRouterLinks.report +
          '/' +
          TSRouterLinks.report_bank_activity +
          '/' +
          TSRouterLinks.report_bank_activity_list
      );
      },
      error => {
        this.apiError = '';
        if (error.error.hasOwnProperty("message")) {
          this.apiError = error.error.message + '';
          if(error.error.hasOwnProperty("suggested_ids")) {
            this.apiError = this.apiError + ' (Suggested Bank Activity No - ' +error.error.suggested_ids +')'
          }
          window.scrollTo(0, 0);
        }
      });
  }

  getAccountsList() {
    this._tripService.getAccounts({ q: this.accountType }).subscribe((response: any) => {
      if(response && response.result && response.result.length>0) {
        this.accountList = response.result;
        this.accountdepositList.push(this.accountList);
        this.accountWithdrawlList.push(this.accountList);
      }
    });
  }

  emptyActivitiesDropdowns() {
    this.initialDetails.depositedIn = [];
    this.initialDetails.withdrawlFrom = [];
  }

  emptyAccounts() {
    this.accountWithdrawlList = [];
    this.accountdepositList = [];
  }

  getSuggestedBankActivityNo(key:string,set?:boolean) {
    this._commonService.getSuggestedIds(key).subscribe((response: any) => {
      let suggestedBankActivityNo = response.result? response.result.bankactivity:'';
      const activities = this.addBankActivityForm.controls['activities'] as UntypedFormArray;
      if(activities && activities.controls.length>0)
        activities.controls[0].get('bank_activity_number').patchValue(suggestedBankActivityNo);
      if(set) {
        this.setSuggestedBankactivityNo();
        document.getElementById('activity-table').scrollIntoView();
        this.apiError = '';
      }
  });
  }

  setSuggestedBankactivityNo() {
    const activities = this.addBankActivityForm.controls['activities'] as UntypedFormArray;
    activities.controls.forEach((act,index) =>{
      if(index>0) {
        let bn = activities.controls[index-1].get('bank_activity_number').value;
        if(bn && bn.length>0) {
          let digit = bn.match(/(\d+)/);
          let final =new ValidationConstants().bankActivityNoPrefix +(Number(digit[0]) + 1).toString();
          act.get('bank_activity_number').patchValue(final);
        }
      }
    });
  }

  modifyWithdrawlList(accountId,index) {
    this.accountWithdrawlList[index] = clone(this.accountList);
    let obj = getObjectFromList(accountId,this.accountWithdrawlList[index]);
    if(isValidValue(obj))
      this.accountWithdrawlList[index].splice(this.accountWithdrawlList[index].indexOf(obj),1);
  }

  modifyDepositList(accountId,index) {
    this.accountdepositList[index] = clone(this.accountList);
    let obj = getObjectFromList(accountId,this.accountdepositList[index]);
    if(isValidValue(obj))
      this.accountdepositList[index].splice(this.accountdepositList[index].indexOf(obj),1);
  }

  addSuggestedBankActivityNumber() {
    this.getSuggestedBankActivityNo(new ValidationConstants().keybankActivity,true);
  }
}
