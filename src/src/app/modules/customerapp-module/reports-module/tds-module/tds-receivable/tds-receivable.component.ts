import { CurrencyService } from './../../../../../core/services/currency.service';
import { Component, OnInit } from '@angular/core';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { TdsService } from '../../../api-services/reports-module-services/tds-service/tds.service';
import moment from 'moment';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { ScreenType, OperationConstants, ScreenConstants } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';

@Component({
  selector: 'app-tds-receivable',
  templateUrl: './tds-receivable.component.html',
  styleUrls: ['./tds-receivable.component.scss'],
  host: {
    "(window:click)": "clickOutToHide($event)"
  }
})
export class TdsReceivableComponent implements OnInit {

  canDownloadTrialBalance: boolean = false;
  selectedRange: Date[];
  dateToday = new Date(dateWithTimeZone());
  endDate = new Date(moment(this.dateToday).format('YYYY-MM-DD'));
  startDate = new Date(moment(this.dateToday).subtract(14, 'days').format('YYYY-MM-DD'));
  selectedType = 'overall';
  currency_type;
  dateParams: any = { start_date: "", end_date: "", filter: "" };
  tdsData: any = []
  p1;
  filter = new ValidationConstants().filter;
  filter_by = 5;
  screenType = ScreenType;
  analyticsType = OperationConstants;
  analyticsScreen = ScreenConstants;
  prefixUrl=getPrefix();
  // Expanded

  constructor(private currency: CurrencyService, private _tdsService: TdsService,private _analytics:AnalyticsService,private _fileDownload:FileDownLoadAandOpen,) {
    this.selectedRange = [this.startDate, this.endDate];
  }

  ngOnInit() {
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.TDSR,this.screenType.VIEW,"Navigated");
    this.currency_type = this.currency.getCurrency();
    document.querySelector('.right-section').scroll(0,0);


  }
  clickOutToHide(e) {
    this.canDownloadTrialBalance = false;
  }
  getTdsReceivable(dateParams) {
    this._tdsService.getTdsReceivable(dateParams).subscribe((response: any) => {
      this.tdsData = response.result;
    });
  }

  filterTdsReceivable(dateRange) {
    if (dateRange && dateRange.length > 0 && dateRange[0] && dateRange[1]) {
      this.dateParams = {
        start_date: changeDateToServerFormat(dateRange[0].toString()),
        end_date: changeDateToServerFormat(dateRange[1].toString()),
        filter: this.selectedType
      }
      this.getTdsReceivable(this.dateParams);
    }
  }

  downLoadxlsx() {
    const title = 'TDSReceivable'
    const type = 'xlsx'
    const params = { start_date: this.dateParams.start_date, end_date: this.dateParams.end_date, export: true }
    this._tdsService.downloadTdsReceivable(params).subscribe((data) => {
      let fileName = title + '(' + this.dateParams['start_date'] + '-To-' + this.dateParams['end_date'] + ')' + '.' + type;
      this._fileDownload.writeAndOpenFile(data, fileName).then(data => {
      });

    })
  }

  onSelectedType(type) {
    this.tdsData = [];
    this.selectedType = type;
    this.dateParams.filter = this.selectedType;
    this.getTdsReceivable(this.dateParams);
  }

}
