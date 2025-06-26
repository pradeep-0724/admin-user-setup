import { Component, OnInit } from '@angular/core';
import { AccountantService } from '../../../api-services/reports-module-services/accountant-services/accountant.service';
import { ActivatedRoute } from '@angular/router';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { ExpandCollapse } from 'src/app/core/services/expandCollapse.service';
import moment from 'moment';
import { ScreenType, OperationConstants, ScreenConstants } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';


@Component({
  selector: 'app-trial-balance',
  templateUrl: './profit-loss.component.html',
  styleUrls: ['profit-loss.component.scss'],
  host: {
    "(window:click)": "clickOutToHide($event)"
  }
})
export class ProfitLossComponent implements OnInit {

  profitLossData: any;
  type: string;
  selectedRange: Date[];
  dateToday = new Date(dateWithTimeZone());
  endDate = new Date(moment(this.dateToday).format('YYYY-MM-DD'));
  startDate = new Date(moment(this.dateToday).subtract(14, 'days').format('YYYY-MM-DD'));
  expenseTotal: number = 0;
  incomeTotal: number = 0;
  companyData: any;
  currency_type;
  showProfit = [];
  showLoss = [];
  dateParams: {};
  canDownloadProfitLoss = false;
  screenType = ScreenType;
  analyticsType = OperationConstants;
  analyticsScreen = ScreenConstants;
  collapseFlag: boolean=true;

  constructor(
    private _accountantService: AccountantService,
    private _activatedroute: ActivatedRoute,
    private currency: CurrencyService,
    private _expandCollapse: ExpandCollapse,
    private _analytics: AnalyticsService,
    private _fileDownload:FileDownLoadAandOpen,

  ) {
    this.selectedRange = [this.startDate, this.endDate];
    this._activatedroute.queryParamMap.subscribe(params => {
      if (isValidValue(params['params']))
        this.type = params['params']['type'];
      if(this.type){
        this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.PROFITANDLOSSTSHAPE,this.screenType.VIEW,"Navigated");
      }else{
        this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.PROFITANDLOSS,this.screenType.VIEW,"Navigated");
      }
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.currency_type = this.currency.getCurrency();
    }, 1000);
  }
  clickOutToHide(e) {
    this.canDownloadProfitLoss = false;
  }
  calculateSubTotalItem(account) {
    account.sub_total = account.amount;
    if (account.accounts.length > 0) {
      account.accounts = this.calculateSubTotal(account.accounts)

      account.accounts.forEach(childAccount => {
        account.sub_total += childAccount.sub_total;
      });
    }
    return account;
  };

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
    for (const [key, value] of Object.entries(data.Expense)) {
      console.log(key)
      this.calculateSubTotal(value);
    }
    for (const [key, value] of Object.entries(data.Income)) {
      console.log(key)
      this.calculateSubTotal(value);
    }
    this.profitLossData = data;
    this.calculateTotal();
    this.expandCollapseAll(false)
  }

  getProfitLossData(dateParams) {
    this._accountantService.getProfitLossAccounts(dateParams).subscribe((response: any) => {
      this.expenseTotal = 0;
      this.incomeTotal = 0;
      this.fixNodeSubTotal(response.result);
      this.companyData = response.company;
    });
  }

  filterProfitLoss(dateRange) {
    if (dateRange && dateRange.length > 0) {
      this.dateParams = {
        start_date: changeDateToServerFormat(dateRange[0].toString()),
        end_date: changeDateToServerFormat(dateRange[1].toString())
      }
      this.getProfitLossData(this.dateParams);
    }
  }

  calculateTotal() {
    for (const [key, value] of Object.entries(this.profitLossData.Expense)) {
      console.log(key)
      this.expenseTotal += this.calculateParentSubTotal(value);
    }
    for (const [key, value] of Object.entries(this.profitLossData.Income)) {
      console.log(key)
      this.incomeTotal += this.calculateParentSubTotal(value);
    }
  }

  calculateParentSubTotal(accounts) {
    let sub_total = 0;
    if (accounts.length > 0) {
      accounts.forEach(acc => {
        sub_total += acc.sub_total;
      });
    }
    return sub_total;
  }

  returnAbsoluteNumber(amount) {
    return Math.abs(amount).toFixed(3);
  }

  identifyAmountType(amount, isExpense: boolean) {
    if (isExpense) {
      if (amount > 0)
        return '(Dr)';
      else if (amount < 0)
        return '(Cr)';
    }
    else {
      if (amount > 0)
        return '(Cr)';
      else if (amount < 0)
        return '(Dr)';
    }
  }

  calculateDifferenceAmount(amount1, amount2) {
    return amount1 - amount2;
  }

  expandCollapseAll(value) {
    this.collapseFlag=value
    let data = {
      first: this.profitLossData.Expense,
      second: this.profitLossData.Income,
      type: value
    }
    let result = this._expandCollapse.getexpandCollapse(data);
    this.showProfit = result['second'];
    this.showLoss = result['first'];
  }

  downLoadxlsxOrpdf(type, title) {
    this._accountantService.profitLossDownloadXlsxOrPdf(this.dateParams['start_date'], this.dateParams['end_date'], type).subscribe((data) => {
      let fileName= title + '(' + this.dateParams['start_date'] + '-To-' + this.dateParams['end_date'] + ')' + '.' + type;
      this._fileDownload.writeAndOpenFile(data, fileName).then(data => {
      });
    })
  }

}
