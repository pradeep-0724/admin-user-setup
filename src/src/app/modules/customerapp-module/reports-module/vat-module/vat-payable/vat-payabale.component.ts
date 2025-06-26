import { CurrencyService } from 'src/app/core/services/currency.service';
import { Component, OnInit } from '@angular/core';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import moment from 'moment';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { VatService } from '../../../api-services/reports-module-services/vat-service/vat.service';
import { ScreenType, OperationConstants, ScreenConstants } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';

@Component({
  selector: 'app-vat-payabale',
  templateUrl: './vat-payabale.component.html',
  styleUrls: ['./vat-payabale.component.scss'],
  host: {
    "(window:click)": "clickOutToHide($event)"
  }
})
export class VatPayabaleComponent implements OnInit {

  canDownloadTrialBalance: boolean = false;
  selectedRange: Date[];
  dateToday = new Date(dateWithTimeZone());
  endDate = new Date(moment(this.dateToday).format('YYYY-MM-DD'));
  startDate = new Date(moment(this.dateToday).subtract(14, 'days').format('YYYY-MM-DD'));
  selectedType = 'overall';
  currency_type;
  dateParams: any = { start_date: "", end_date: "", filter: "" };
  vatData: any = []
  p1;
  filter_by = 5;
  filter = new ValidationConstants().filter;
  screenType = ScreenType;
  analyticsType = OperationConstants;
  analyticsScreen = ScreenConstants;
  prefixUrl=getPrefix();
  // Expanded

  constructor(private currency: CurrencyService, private _vatService: VatService,private _analytics:AnalyticsService,private _fileDownload:FileDownLoadAandOpen,) {
    this.selectedRange = [this.startDate, this.endDate];
  }

  ngOnInit() {
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.VATP,this.screenType.VIEW,"Navigated");
    this.currency_type = this.currency.getCurrency();
    document.querySelector('.right-section').scroll(0,0);


  }

  clickOutToHide(e) {
    this.canDownloadTrialBalance = false;
  }

  getVatPayable(dateParams) {
    this._vatService.getVatPayable(dateParams).subscribe((response: any) => {
      this.vatData = response.result;
    });
  }

  filterVatReceivable(dateRange) {
    if (dateRange && dateRange.length > 0 && dateRange[0] && dateRange[1]) {
      this.dateParams = {
        start_date: changeDateToServerFormat(dateRange[0].toString()),
        end_date: changeDateToServerFormat(dateRange[1].toString()),
        filter: this.selectedType
      }
      this.getVatPayable(this.dateParams);
    }
  }

  downLoadxlsx(type) {
    const title = 'VATPayable'
    const params = { start_date: this.dateParams.start_date, end_date: this.dateParams.end_date, export: true ,file_type: type}
    this._vatService.downloadVatPayable(params).subscribe((data) => {
      let fileName = title + '(' + this.dateParams['start_date'] + '-To-' + this.dateParams['end_date'] + ')' + '.' + type;
      this._fileDownload.writeAndOpenFile(data, fileName).then(data => {
      });
    })
  }

  onSelectedType(type) {
    this.vatData = [];
    this.selectedType = type;
    this.dateParams.filter = this.selectedType;
    this.getVatPayable(this.dateParams);
  }


  
}
