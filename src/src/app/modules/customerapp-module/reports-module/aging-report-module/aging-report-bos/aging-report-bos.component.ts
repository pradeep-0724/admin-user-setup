import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { AgingReportService } from '../../../api-services/reports-module-services/aging-report-service/aging-report.service';
import { getSetViewDetails } from 'src/app/core/services/getsetviewdetails.service';
import { ScreenType, OperationConstants, ScreenConstants } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { DropDownType, ListWidgetData } from '../../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2-interface';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-aging-report-bos',
  templateUrl: './aging-report-bos.component.html',
  styleUrls: ['./aging-report-bos.component.scss']
})
export class AgingReportBosComponent implements OnInit {
  apiError = '';
  currency_type: any;
  screenName = "ageing_bos/"
  tabSelected = 'all';
  storeData = [];
  prefixUrl = '';
  filterUrl = 'revenue/ageing_bos/filters/'
  tabSelectionList: Array<DropDownType> = [
    {
      label: "All BoS Aging Report",
      value: "0",
    },
    {
      label: "Future",
      value: "1",
    },
    {
      label: "0-15 Days",
      value: "2",
    },
    {
      label: "16-30 Days",
      value: "3",
    },
    {
      label: "31-45 Days",
      value: "4",
    },
    {
      label: "46-60 Days",
      value: "5",
    },
    {
      label: "60+ Days",
      value: "6",
    },
  ];
  listQueryParams = {
    next_cursor: '',
    search: '',
    status: '0',
    filters: '[]',
    export:false,
  }
  screenType = ScreenType;
  analyticsType = OperationConstants;
  analyticsScreen = ScreenConstants;
  isLoading=false;
  constructor(private _agingReport: AgingReportService, private currency: CurrencyService, private _analytics:AnalyticsService,
    private _route: Router, private _viewService: getSetViewDetails, private _fileDownload:FileDownLoadAandOpen,

    private _prefixUrl: PrefixUrlService) { }

  ngOnInit() {
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.AGINGREPORTSBOS,this.screenType.VIEW,"Navigated");
    this.prefixUrl = this._prefixUrl.getprefixUrl();
    this.currency_type = this.currency.getCurrency();
    this.getAgingReport(this.listQueryParams)
  }

  getAgingReport(params) {
    this._agingReport.getAgingReport(this.screenName,params).subscribe(data => {
      this.storeData = data['result'].bos;
      params.next_cursor = data['result'].next_cursor;
    })
  }

  routeToBos(id) {
    let viewDetails = {
      id: id,
      screen: 'VP',
      sub_screen: ''
    }
    let queryParams= new Object({
      pdfViewId : id
    })
    this._viewService.viewInfo = viewDetails;
    this._route.navigate([this.prefixUrl + "/income/billofsupply/list"],{queryParams})
  }

  exportXls(e) {
    let params=cloneDeep(this.listQueryParams)
    delete params.next_cursor;
    params.export=true
    this._agingReport.getAgingReportDownload(this.screenName,params).subscribe(resp => {
      let type = 'xlsx'
      let filename = this.screenName +'_'+this.tabSelectionList[params.status].label
      this._fileDownload.writeAndOpenFile(resp, filename+ '.' + type).then(data => {
      });
    })
  }

  onScroll(event) {
    const container = document.querySelector('.custom-table-container');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoading && this.listQueryParams.next_cursor?.length > 0) {
      this.onScrollAgingReport(this.listQueryParams);
    }
  }

  onScrollAgingReport(params){
    this.isLoading = true;
    this._agingReport.getAgingReport(this.screenName,params).subscribe(data => {
      this.storeData.push(...data['result'].bos)
      params.next_cursor = data['result'].next_cursor;
      this.isLoading = false;
    })
  }

 

  listWidgetData(widgetData: ListWidgetData) {
    this.listQueryParams.filters=JSON.stringify(widgetData.filterKeyData);
    this.listQueryParams.search=widgetData.searchValue;
    this.listQueryParams.status=widgetData.tabSelection;
    this.listQueryParams.next_cursor='';
    this.getAgingReport(this.listQueryParams)
  }


}
