import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormArray, Validators } from '@angular/forms';
import { OpeningBalanceService } from '../../../../api-services/master-module-services/chart-of-account-service/chart-of-account.service';
import { defaultZero, formatNumberToFloat } from 'src/app/shared-module/utilities/currency-utils';
import { isValidValue , roundOffAmount, getObjectFromList } from 'src/app/shared-module/utilities/helper-utils';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { cloneDeep } from 'lodash';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';


@Component({
  selector: 'app-add-chart-of-account',
  templateUrl: './add-chart-of-account.component.html',
  styleUrls: ['./add-chart-of-account.component.scss'],
})
export class AddChartOfAccountComponent implements OnInit {
  search: any;
  chartOfAccountsForm: UntypedFormGroup;
  accountList: any = [];
  totalCredit: number = 0;
  totalDebit: number = 0;
  // Opening Balance Adjustment
  obaCredit: number = 0;
  obaDebit: number = 0;
  totalAmountCredit: number = 0;
  totalAmountDebit: number = 0;
  showModal = false;
  accountEntries: Array<any> = [];
  openingBalAdjustmentName = 'Opening Balance Adjustments';
  oldOpeningBalanceDate: any = null;
  min_date: any;
  max_date: any;
  apiError: string = '';
  balanceDateExists: boolean = false;
  currency_type;
  prefixUrl = '';
  screenType=ScreenType;
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;


  videoUrl ="https://ts-pub-directory.s3.ap-south-1.amazonaws.com/Bank+n+Chart+of+Accounts.mp4";

  constructor(
    private _fb: UntypedFormBuilder,
    private _router: Router,
    private _openingBalanceService: OpeningBalanceService,
    private currency:CurrencyService,
    private _activatedroute: ActivatedRoute,
    private _prefixUrl : PrefixUrlService,
    private _analytics:AnalyticsService,
    private _popupBodyScrollService:popupOverflowService,
    private apiHandler: ApiHandlerService,
  ) { }

  ngOnInit() {
    this.getChartOfAccounts();
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.COA,this.screenType.ADD,"Navigated");
    this.prefixUrl = this._prefixUrl.getprefixUrl();
    this._activatedroute.queryParams.subscribe((params)=>{
      this.showModal=params.showModal;
    })
  }
  popupOverflowActive(){
    this._popupBodyScrollService.popupActive()
   }
  buildForm() {
     setTimeout(() => {
      this.currency_type = this.currency.getCurrency();
    }, 1000);
    this.chartOfAccountsForm = this._fb.group({
      opening_balance_date: [null, [Validators.required]],
      account_entries: this._fb.array([])
    });
  }

  getChartOfAccounts(request?) {
    this.buildForm();
    this._openingBalanceService.getCoaAvailableBal(request?request:null).subscribe((response: any) => {
      if (isValidValue(response.date_range)) {
        this.min_date = response.date_range.min_date;
        this.max_date = response.date_range.max_date;
      }
      if (isValidValue(response.op_bal_date)) {
        this.balanceDateExists = true;
        this.oldOpeningBalanceDate = response.op_bal_date;
        this.chartOfAccountsForm.controls["opening_balance_date"].setValue(response.op_bal_date);
      }
      this.accountList = response.result;
      this.buildAccounts(this.accountList);
      this.calculateTotals();
      this.disableCreditDebitOnInit();
    });
  }

  calculateTotals(account?) {
    // this.setOba();
    if(account) {
      this.setEntry(account);
    }
    const accounts = this.chartOfAccountsForm.controls["account_entries"] as UntypedFormArray;
    this.totalDebit = 0;
    this.totalCredit = 0;
    accounts.controls.filter((acc) => {
      this.totalDebit = Number(formatNumberToFloat(defaultZero(this.totalDebit))) + Number(formatNumberToFloat(defaultZero(acc.get("debit").value)));
      this.totalCredit = Number(formatNumberToFloat(defaultZero(this.totalCredit))) + Number(formatNumberToFloat(defaultZero(acc.get("credit").value)));
    });
    let difference = this.totalDebit - this.totalCredit;
    this.obaDebit  = difference >= 0 ? 0 : Math.abs(difference);
    this.obaCredit = difference >= 0 ? Math.abs(difference) : 0;
    this.totalAmountDebit = formatNumberToFloat(this.totalDebit + this.obaDebit);
    this.totalAmountCredit = formatNumberToFloat(this.totalCredit + this.obaCredit);
    this.obaCredit = formatNumberToFloat(this.obaCredit);
    this.obaDebit = formatNumberToFloat(this.obaDebit);
  }

  // setEntry(account:any) {
  //   const copyAccount = cloneDeep(account);
  //   copyAccount.credit = defaultZero(copyAccount.credit);
  //   copyAccount.debit = defaultZero(copyAccount.debit);
  //   delete copyAccount.disableCredit;
  //   delete copyAccount.disableDebit;
  //   if((copyAccount.credit && copyAccount.credit>0) || (copyAccount.debit && copyAccount.debit>0)) {
  //     if(this.accountEntries.length) {
  //       let existingEntry = getObjectFromList(copyAccount.id,this.accountEntries);
  //       if(isValidValue(existingEntry) && existingEntry.id ) {
  //         this.accountEntries.forEach((entry,index) => {
  //           if(entry.id == existingEntry.id) {
  //           this.accountEntries[index] = copyAccount;
  //           }
  //         })
  //       }
  //       else {
  //         this.accountEntries.push(copyAccount);
  //       }
  //     }
  //     else {
  //       this.accountEntries.push(copyAccount);
  //     }
  //   }
  //   else {
  //     let existingEntry = getObjectFromList(account.id,this.accountEntries);
  //     if(isValidValue(existingEntry) && existingEntry.id ) {
  //       this.accountEntries.splice(this.accountEntries.indexOf(existingEntry),1);
  //     }
  //   }
  // }

  setEntry(account:any) {
    const copyAccount = cloneDeep(account);
    copyAccount.credit = defaultZero(copyAccount.credit);
    copyAccount.debit = defaultZero(copyAccount.debit);
    delete copyAccount.disableCredit;
    delete copyAccount.disableDebit;
    // if((copyAccount.credit && copyAccount.credit>0) || (copyAccount.debit && copyAccount.debit>0)) {
    if(this.accountEntries.length) {
      let existingEntry = getObjectFromList(copyAccount.id,this.accountEntries);
      if(isValidValue(existingEntry) && existingEntry.id ) {
        this.accountEntries.forEach((entry,index) => {
          if(entry.id == existingEntry.id) {
          this.accountEntries[index] = copyAccount;
          }
        })
      }
      else {
        this.accountEntries.push(copyAccount);
      }
    }
    else {
      this.accountEntries.push(copyAccount);
    }
  }
    // else {
    //   let existingEntry = getObjectFromList(account.id,this.accountEntries);
    //   if(isValidValue(existingEntry) && existingEntry.id ) {
    //     this.accountEntries.splice(this.accountEntries.indexOf(existingEntry),1);
    //   }
    // }
  // }

  addAccount(item: any) {
    return this._fb.group({
      id: [
        item.id || ''
      ],
      name: [
        item.name || ''
      ],
      debit: [
        item.debit || 0
      ],
      credit: [
        item.credit || 0
      ],
      disableCredit : [
        false
      ],
      disableDebit : [
        false
      ],
      is_frozen : [
        item.is_frozen || false
      ]
    });
  }

  setOba() {
    const accounts = this.chartOfAccountsForm.controls["account_entries"] as UntypedFormArray;
    accounts.controls.filter((acc) => {
      if (acc.get("name").value == "Opening Balance Adjustments") {
        this.obaDebit = defaultZero(acc.get("debit").value);
        this.obaCredit = defaultZero(acc.get("credit").value);
      }
    });
  }

  buildAccounts(items: any = []) {
    this.accountEntries = [];
    const accounts = this.chartOfAccountsForm.controls["account_entries"] as UntypedFormArray;
    items.forEach((item) => {
      accounts.push(this.addAccount(item));
      // if((item.credit && item.credit>0) || (item.debit && item.debit>0)) {
      //   if(item.name.localeCompare(this.openingBalAdjustmentName) !== 0) {
      //     let coa = {
      //       credit: item.credit,
      //       debit: item.debit,
      //       id: item.id,
      //       name: item.name
      //     }
      //     this.accountEntries.push(coa);
      //   }
      // }
    });
  }

  prepareRequest(form: UntypedFormGroup) {
    let params = {
      entries : this.accountEntries,
      adjustment_amount : {
        credit : Number(this.obaCredit),
        debit : Number(this.obaDebit)
      }
    }
    return params;
  }

  submitOpeningBalance() {
    const form = this.chartOfAccountsForm;
    const request = this.prepareRequest(form);
    if (form.valid) {
      if (this.accountEntries.length == 0 && changeDateToServerFormat(form.value['opening_balance_date']) == this.oldOpeningBalanceDate) {
        this._router.navigateByUrl(this.prefixUrl + '/onboarding/chart-of-account/list');
      } else {
        let dateParams = {
          start_date: changeDateToServerFormat(form.value['opening_balance_date'])
        }
        this.apiHandler.handleRequest(this._openingBalanceService.postOpeningBalance(request, dateParams), 'COA added successfully!').subscribe(
          {
            next: () => {
              this._router.navigateByUrl(this.prefixUrl + '/onboarding/chart-of-account/list');
            },
            error: (err) => {
              if (err.message)
                this.apiError = err.message;
              return;
            }
          }
        );
      }
    }
  }

  refresh($event) {
    if($event)
      this.getChartOfAccounts();
  }

  filterChartofAccountsByDate(openingBalanceDate) {
    let request;
      if(openingBalanceDate) {
      request = {
        start_date : changeDateToServerFormat(openingBalanceDate)
      }
    }
    this.getChartOfAccounts(request);
  }

  disableDebitCredit(account:UntypedFormGroup,accountType) {
    if(accountType == new ValidationConstants().debit) {
      if(account.controls.debit.value > 0) {
        account.controls.disableCredit.patchValue(true);
        account.controls.disableDebit.patchValue(false);
      }
      else {
        this.enableDebitAndCredit(account);
      }
    }
    else if(accountType == new ValidationConstants().credit) {
      if(account.controls.credit.value > 0) {
        account.controls.disableDebit.patchValue(true);
        account.controls.disableCredit.patchValue(false);
      }
      else {
        this.enableDebitAndCredit(account);
      }
    }
  }

  enableDebitAndCredit(account) {
    account.controls.disableCredit.patchValue(false);
    account.controls.disableDebit.patchValue(false);
  }

  disableCreditDebitOnInit() {
    const account_entries = this.chartOfAccountsForm.controls.account_entries as UntypedFormArray;
    account_entries.controls.forEach((account:UntypedFormGroup) =>{
      if(account.controls.is_frozen.value) {
        account.controls.disableCredit.patchValue(true);
        account.controls.disableDebit.patchValue(true);
        return;
      }
      if(account.controls.debit.value > 0) {
        account.controls.disableCredit.patchValue(true);
        account.controls.disableDebit.patchValue(false);
      }
      else if(account.controls.credit.value > 0) {
        account.controls.disableDebit.patchValue(true);
        account.controls.disableCredit.patchValue(false);
      }
    });

  }

  // round off amount
  roundOffAmount(formControl) {
    roundOffAmount(formControl);
  }
}
