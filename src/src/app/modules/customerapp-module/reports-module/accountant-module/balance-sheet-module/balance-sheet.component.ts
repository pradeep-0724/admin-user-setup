import { Component, OnInit } from '@angular/core';
import { AccountantService } from '../../../api-services/reports-module-services/accountant-services/accountant.service';
import { ActivatedRoute } from '@angular/router';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { merge } from 'lodash';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { ExpandCollapse } from 'src/app/core/services/expandCollapse.service';
import moment from 'moment';
import { ScreenType, OperationConstants, ScreenConstants } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';

@Component({
  selector: 'app-trial-balance',
  templateUrl: './balance-sheet.component.html',
  styleUrls: ['./balance-sheet.component.scss'],
  host: {
    "(window:click)": "clickOutToHide($event)"
  }
})
export class BalanceSheetComponent implements OnInit {
  type: string;
  balanceSheetData: any;
  equityAndLiabilities: any;
  selectedRange: Date[];
  dateToday = new Date(dateWithTimeZone());
  endDate = new Date(moment(this.dateToday).format('YYYY-MM-DD'));
  startDate = new Date(moment(this.dateToday).subtract(14, 'days').format('YYYY-MM-DD'));
  assetsTotal: number = 0;
  equityLiabilityTotal: number = 0;
  companyData: any;
  currency_type;
  showAll = false;
  show = [];
  showAssets = [];
  canDownloadBalance = false;
  dateParams: {};
  screenType = ScreenType;
  analyticsType = OperationConstants;
  analyticsScreen = ScreenConstants;
  collapseFlag: boolean=true;

  constructor(
    private _accountantService: AccountantService,
    private currency: CurrencyService,
    private _expandCollapse: ExpandCollapse,
    private _analytics:AnalyticsService,
    private _fileDownload:FileDownLoadAandOpen,
    private _activatedroute: ActivatedRoute,
  ) {
    this.selectedRange = [this.startDate, this.endDate];
    this._activatedroute.queryParamMap.subscribe(params => {
      if (isValidValue(params['params']))
        this.type = params['params']['type'];
      if(this.type){
        this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.BALANCESHEETTSHAPE,this.screenType.VIEW,"Navigated");
      }else{
        this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.BALANCESHEET,this.screenType.VIEW,"Navigated");
      }

    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.currency_type = this.currency.getCurrency();
    }, 1000);
  }
  clickOutToHide(e) {
    this.canDownloadBalance = false;
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
    for (const [key, value] of Object.entries(data.Assets)) {
      console.log(key)
      this.calculateSubTotal(value);
    }
    for (const [key, value] of Object.entries(data.Liability)) {
      console.log(key)
      this.calculateSubTotal(value);
    }
    for (const [key, value] of Object.entries(data.Equity)) {
      console.log(key)
      this.calculateSubTotal(value);
    }
    this.balanceSheetData = data;
    this.equityAndLiabilities = merge(data.Liability, data.Equity);
    this.calculateTotal();
    this.expandCollapseAll(false)
  }

  getBalanceSheet(dateParams) {
    this._accountantService.getBalanceSheetAccounts(dateParams).subscribe((response: any) => {
      this.assetsTotal = 0;
      this.equityLiabilityTotal = 0;
      this.fixNodeSubTotal(response.result);
      this.companyData = response.company;
    });
  }

  filterBalanceSheet(dateRange) {
    if (dateRange && dateRange.length > 0 && dateRange[0] && dateRange[1]) {
      this.dateParams = {
        start_date: changeDateToServerFormat(dateRange[0].toString()),
        end_date: changeDateToServerFormat(dateRange[1].toString())
      }
      this.getBalanceSheet(this.dateParams);
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

  calculateTotal() {
    for (const [key, value] of Object.entries(this.balanceSheetData.Assets)) {
      console.log(key)
      this.assetsTotal += this.calculateParentSubTotal(value);
    }
    for (const [key, value] of Object.entries(this.equityAndLiabilities)) {
      console.log(key)
      this.equityLiabilityTotal += this.calculateParentSubTotal(value);
    }
  }

  returnAbsoluteNumber(amount) {
    return Number(Math.abs(amount).toFixed(3));
  }

  identifyAmountType(amount, isAsset: boolean) {
    if (isAsset) {
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

  identifyProfitOrLoss(netAmount) {
    return netAmount > 0 ? new ValidationConstants().profit : netAmount < 0 ? new ValidationConstants().loss : new ValidationConstants().amount;
  }

  calculateNetAmount(equityLiabilityTotal, netAmount) {
    return this.returnAbsoluteNumber(Number(equityLiabilityTotal)) + this.returnAbsoluteNumber(Number(netAmount));
  }

  expandCollapseAll(value) {
    this.collapseFlag=value
    let data = {
      first: this.equityAndLiabilities,
      second: this.balanceSheetData.Assets,
      type: value
    }
    let result = this._expandCollapse.getexpandCollapse(data);
    this.show = result['first'];
    this.showAssets = result['second'];
  }

  downLoadxlsxOrpdf(type, title) {
    this._accountantService.balanceSheetDownloadXlsxOrPdf(this.dateParams['start_date'], this.dateParams['end_date'], type).subscribe((data) => {
      let fileName = title + '(' + this.dateParams['start_date'] + '-To-' + this.dateParams['end_date'] + ')' + '.' + type;
      this._fileDownload.writeAndOpenFile(data, fileName).then(data => {
      });
    })
  }
  fixedTo3Decimal(value){
    return Number(value).toFixed(3)
   }
}
