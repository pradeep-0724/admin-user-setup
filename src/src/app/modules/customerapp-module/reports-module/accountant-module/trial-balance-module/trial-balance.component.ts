import { Component, OnInit } from '@angular/core';
import { AccountantService } from '../../../api-services/reports-module-services/accountant-services/accountant.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { CurrencyService } from 'src/app/core/services/currency.service';
import moment from 'moment';
import { ScreenType, OperationConstants, ScreenConstants } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { formatNumber } from 'src/app/shared-module/pipes/numberformat.pipe';


@Component({
  selector: 'app-trial-balance',
  templateUrl: './trial-balance.component.html',
  styleUrls: ['./trial-balance.component.scss'],
  host: {
    "(window:click)": "clickOutToHide($event)"
  }
})
export class TrialBalanceComponent implements OnInit {
  trialBalanceData: any;
  selectedRange: Date[];
  expandAll = false;
  dateToday = new Date(dateWithTimeZone());
  endDate = new Date(moment(this.dateToday).format('YYYY-MM-DD'));
  startDate = new Date(moment(this.dateToday).subtract(14, 'days').format('YYYY-MM-DD'));

  totalDebit: number = 0;
  totalCredit: number = 0;
  companyData: any;
  currency_type;
  accountGroupShow = [];
  canDownloadTrialBalance = false;
  dateParams = {};
  screenType = ScreenType;
  analyticsType = OperationConstants;
  analyticsScreen = ScreenConstants;


  constructor(
    private _accountantService: AccountantService, private currency: CurrencyService,private _analytics:AnalyticsService,private _fileDownload:FileDownLoadAandOpen,

  ) {
    this.selectedRange = [this.startDate, this.endDate];
  }

  ngOnInit() {
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.TRIALBALANCE,this.screenType.LIST,"Navigated");
    setTimeout(() => {
      this.currency_type = this.currency.getCurrency();
    }, 1000);
  }

  calculateSubTotalItem(account) {
    account.credit_sub_total = Number(account.amount.credit);
    account.debit_sub_total = Number(account.amount.debit);
    if (account.accounts.length > 0) {
      account.accounts = this.calculateSubTotal(account.accounts);
      account.accounts.forEach(childAccount => {
        account.credit_sub_total += childAccount.credit_sub_total;
        account.debit_sub_total += childAccount.debit_sub_total;
      });
    }
    return account;
  };
  clickOutToHide(e) {
    this.canDownloadTrialBalance = false;
  }
  calculateSubTotal(accounts) {
    var i, account, len, new_accounts;
    new_accounts = [];
    for (i = 0, len = accounts.length; i < len; i++) {
      account = accounts[i];
      new_accounts.push(this.calculateSubTotalItem(account));
    }
    return new_accounts;
  }

  fixNodeSubTotal(data) {
    this.iterateOnKeyValue(data.Assets);
    this.iterateOnKeyValue(data.Equity);
    this.iterateOnKeyValue(data.Expense);
    this.iterateOnKeyValue(data.Income);
    this.iterateOnKeyValue(data.Liability);
    this.trialBalanceData = data;
    this.calculateTotal();
    this.expandCollapseAll(false)
  }

  iterateOnKeyValue(accountObj) {
    for (const [key, value] of Object.entries(accountObj)) {
      console.log(key)
      this.calculateSubTotal(value);
    }
  }

  getTrialBalance(dateParams) {
    this._accountantService.getTrialBalanceAccounts(dateParams).subscribe((response: any) => {
      this.totalCredit = 0;
      this.totalDebit = 0;
      this.fixNodeSubTotal(response.result);
      this.companyData = response.company;
    });
  }

  filterTrialBalance(dateRange) {
    if (dateRange && dateRange.length > 0) {
      this.dateParams = {
        start_date: changeDateToServerFormat(dateRange[0].toString()),
        end_date: changeDateToServerFormat(dateRange[1].toString())
      }
      this.getTrialBalance(this.dateParams);
    }
  }

  returnAbsoluteNumber(amount) {
    return formatNumber(Number(Math.abs(amount).toFixed(3)));
  }


  calculateParentCreditSubTotal(accounts) {
    let total = 0;
    if (accounts.length > 0) {
      accounts.forEach(item => {
        if (item && item.credit_sub_total) {
          total += item.credit_sub_total;
        }
      });
    }
    return Number(total.toFixed(3));
  }

  calculateParentDebitSubTotal(accounts) {
    let total = 0;
    if (accounts.length > 0) {
      accounts.forEach(item => {
        if (item && item.debit_sub_total) {
          total += item.debit_sub_total;
        }
      });
    }
    return (Number(total.toFixed(3)));
  }

  accessKeyValue(accountObj) {
    for (const [key, value] of Object.entries(accountObj)) {
      console.log(key)
      this.totalCredit += this.calculateParentCreditSubTotal(value);
      this.totalDebit += this.calculateParentDebitSubTotal(value);
    }
  }

  calculateTotal() {
    this.accessKeyValue(this.trialBalanceData.Assets);
    this.accessKeyValue(this.trialBalanceData.Equity);
    this.accessKeyValue(this.trialBalanceData.Expense);
    this.accessKeyValue(this.trialBalanceData.Income);
    this.accessKeyValue(this.trialBalanceData.Liability);
  }

  // to do for better solution
  expandCollapseAll(value) {
    this.accountGroupShow = [];
    for (let x = 0; x < 50; x++) {
      this.accountGroupShow.push([])

      for (let y = 0; y < 20; y++) {
        this.accountGroupShow[x].push(value)
      }
    }
    this.expandAll = value;
  }



  downLoadxlsxOrpdf(type, title) {
    this._accountantService.trialBalanceDownloadXlsxOrPdf(this.dateParams['start_date'], this.dateParams['end_date'], type).subscribe((data) => {
      let fileName = title + '(' + this.dateParams['start_date'] + '-To-' + this.dateParams['end_date'] + ')' + '.' + type;
      this._fileDownload.writeAndOpenFile(data, fileName).then(data => {
      });

    })
  }

  fixedTo3Decimal(value){
    return formatNumber(Number(Number(value).toFixed(3)))
   }
}
