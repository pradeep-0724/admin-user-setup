import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormArray, AbstractControl, Validators, UntypedFormControl } from '@angular/forms';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { TripService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/trip-services/trip.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { ActivatedRoute, Router } from '@angular/router';
import { BankingService } from '../../../../api-services/reports-module-services/banking-service/banking.service';
import { isValidValue, getObjectFromList } from 'src/app/shared-module/utilities/helper-utils';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { CommonService } from 'src/app/core/services/common.service';
import { merge, clone } from 'lodash';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { EmployeeService } from 'src/app/modules/customerapp-module/api-services/master-module-services/employee-service/employee-service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';

@Component({
  selector: 'app-edit-bank-activity',
  templateUrl: './edit-bank-activity.component.html',
  styleUrls: ['./edit-bank-activity.component.scss']
})
export class EditBankActivityComponent implements OnInit {
  editBankActivityForm: UntypedFormGroup;
  employeeList: any = [];
  dateToday: any;
  accountList: Array<any> = [];
  accountType = new ValidationConstants().accountType.join(',');
  currency_type;
  initialDetails = {
    employee: {},
    depositedIn: [],
    withdrawlFrom: []
  }
  bankActivityId : any;
  bankActivitydata: any;
  apiError: string;
  suggestedBankActivityNo: string;
  deletedActivitiesObject = {
    deleted_activities : []
  };
  accountdepositList: Array<any> = [];
  accountWithdrawlList : Array<any> = [];
  prefixUrl: string;
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;
  screenType=ScreenType;

  constructor(private _tripService: TripService,
    private _commonService: CommonService,
    private _fb: UntypedFormBuilder,
    private bankService: BankingService,
    private _activeRoute: ActivatedRoute,
    private _router: Router,
    private currency:CurrencyService,
    private _analytics:AnalyticsService,
    private _employeeService: EmployeeService,
    private _prefixUrl:PrefixUrlService) {
      this.dateToday = new Date(dateWithTimeZone());
    }

  ngOnInit() {
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.BANKACTIVITY,this.screenType.EDIT,"Navigated");
     setTimeout(() => {
      this.prefixUrl = this._prefixUrl.getprefixUrl();
      this.currency_type = this.currency.getCurrency();
    }, 1000);
    this.getAccountsList();
		this._activeRoute.params.subscribe((params) => {
      this.bankActivityId = params.bank_activity_id;
      this.buildForm();
      this.getAllEmployees();
      this.getSuggestedBankActivityNo(new ValidationConstants().keybankActivity);
		});
	}

  ngAfterViewInit() {
		setTimeout(() => {
			this.getFormValues();

		}, 1);
  }

  getFormValues() {
		this.bankService.getBankActivityById(this.bankActivityId).subscribe((response: any) => {
      this.bankActivitydata = response.result;
      this.patchFormValues(this.bankActivitydata);
		});
  }

  patchFormValues(data: any) {
    if (isValidValue(data)) {
      this.initialDetails.employee = {
        label : isValidValue(data.employee) ? data.employee.first_name : 'Choose'
      }
      data.employee = isValidValue(data.employee) ? data.employee.id : null;
      if(data.activities && data.activities.length>0) {
        data.activities.forEach(act => {
          let depositDropdown = new Object;
          depositDropdown = {
            label : isValidValue(act.deposited_in) ? act.deposited_in.name : 'Choose',
          }
          let withdrawlDropdown = new Object;
          withdrawlDropdown = {
            label : isValidValue(act.withdrawl_from) ? act.withdrawl_from.name : 'Choose',
          }
          act.deposited_in = isValidValue(act.deposited_in) ? act.deposited_in.id : null;
          act.withdrawl_from = isValidValue(act.withdrawl_from) ? act.withdrawl_from.id : null;
          this.initialDetails.depositedIn.push(depositDropdown);
          this.initialDetails.withdrawlFrom.push(withdrawlDropdown);
        });
        this.buildActivities(data.activities);
        } else {
        	this.buildActivities([
        		{}
        	]);
      }
      this.editBankActivityForm.patchValue(data);
		}
	}

  buildForm() {
    this.editBankActivityForm = this._fb.group({
      employee: [null],
      date: [null,
        [Validators.required]
      ],
      description: [null],
      activities: this._fb.array([]),
    });
  }

  buildActivities(items: any[]) {
    const activities = this.editBankActivityForm.controls['activities'] as UntypedFormArray;
    items.forEach((item,index) => {
      activities.push(this.addActivity(item));
      this.accountdepositList.push(this.accountList);
      this.accountWithdrawlList.push(this.accountList);
      if(item.withdrawl_from)
        this.modifyDepositList(item.withdrawl_from,index);
      if(item.deposited_in)
        this.modifyWithdrawlList(item.deposited_in,index)
    });
  }

  addMoreActivity() {
    const activities = this.editBankActivityForm.controls['activities'] as UntypedFormArray;
    const activityForm = this.addActivity({});
    activities.push(activityForm);
    this.setFirstNodeBnSuggested();
    this.accountWithdrawlList.push(this.accountList);
    this.accountdepositList.push(this.accountList);
  }

  removeActivity(index,id) {
    if(id) {
      this.deletedActivitiesObject.deleted_activities.push(id);
    }
    (this.editBankActivityForm.controls['activities'] as UntypedFormArray).removeAt(index);
    this.initialDetails.depositedIn.splice(index,1);
    this.initialDetails.withdrawlFrom.splice(index,1);
    this.accountWithdrawlList.splice(index,1);
    this.accountdepositList.splice(index,1);
  }

  clearActivities() {
    const activities = this.editBankActivityForm.controls['activities'] as UntypedFormArray;
    let resetArray = [];
    activities.controls.forEach((act) => {
      let resetObj = {
        id : act.get('id').value,
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

  addActivity(item: any) {
    const form = this._fb.group({
      id: [
        item.id || null
      ],
      transaction_date: [
        item.transaction_date || this.dateToday || null,
        [Validators.required]
      ],
      reference_number: [
       item.reference_number || null
      ],
      bank_activity_number: [
        item.bank_activity_number || null,
        [Validators.required]
      ],
      deposited_in: [
        item.deposited_in || null,
        [Validators.required]
      ],
      withdrawl_from: [
        item.withdrawl_from || null,
        [Validators.required]
      ],
      amount: [
        item.amount || 0,
        [Validators.required]
      ]
    });
    return form;
  }

  getAllEmployees() {
    this._employeeService.getEmployeeList().subscribe((response) => {
      if (response && response.length > 0) {
        this.employeeList = response;
      }
    });
  }

  getAccountsList() {
    this._tripService.getAccounts({ q: this.accountType }).subscribe((response: any) => {
      if (response && response.result && response.result.length > 0)
        this.accountList = response.result;
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

  addErrorClass(controlName: AbstractControl) {
		return TransportValidator.addErrorClass(controlName);
  }

  submitBankActivityForm() {
    const form = this.editBankActivityForm ;
    form.get('date').patchValue(changeDateToServerFormat(form.get('date').value));
    const activities = this.editBankActivityForm.controls['activities'] as UntypedFormArray;
    activities.controls.forEach(act =>{
      act.get('transaction_date').patchValue(changeDateToServerFormat(act.get('transaction_date').value));
    })
    if(form.valid) {
      let request = merge(form.value,this.deletedActivitiesObject);
      this.updateBankActivity(request);
    }
    else {
      this.setAsTouched(form);
    }
  }

  updateBankActivity(request) {
    this.bankService.updateBankActivity(request,this.bankActivityId).subscribe(
      res => {
        this._analytics.addEvent(this.analyticsType.UPDATED,this.analyticsScreen.BANKACTIVITY)
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

  getSuggestedBankActivityNo(key:string) {
    this._commonService.getSuggestedIds(key).subscribe((response: any) => {
      this.suggestedBankActivityNo = response.result? response.result.bankactivity:'';
  });
  }

  setSuggestedBankactivityNo(lastIndex) {
    const activities = this.editBankActivityForm.controls['activities'] as UntypedFormArray;
    activities.controls.forEach((act,index) =>{
      if(index>lastIndex) {
        let bn = activities.controls[index-1].get('bank_activity_number').value;
        if(bn && bn.length>0) {
          let digit = bn.match(/(\d+)/);
          let final =new ValidationConstants().bankActivityNoPrefix +(Number(digit[0]) + 1).toString();
          act.get('bank_activity_number').patchValue(final);
        }
      }
    });
  }

  patchExistingBn() {
    const activities = this.editBankActivityForm.controls['activities'] as UntypedFormArray;
    this.bankActivitydata.activities.forEach((activity,index) => {
      activities.controls[index].patchValue(activity.bank_activity_number);
    });
    this.setFirstNodeBnSuggested();
    document.getElementById('activity-table').scrollIntoView();
    this.apiError = '';
  }

  setFirstNodeBnSuggested() {
    const activities = this.editBankActivityForm.controls['activities'] as UntypedFormArray;
      for(let i = 0; i< activities.controls.length ; i ++) {
        if(!activities.controls[i].get('id').value) {
          activities.controls[i].get('bank_activity_number').patchValue(this.suggestedBankActivityNo);
          this.setSuggestedBankactivityNo(i);
          break;
        }
      }
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
}
