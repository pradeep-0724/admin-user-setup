import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { getSetViewDetails } from 'src/app/core/services/getsetviewdetails.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { AgingReportService } from '../../../api-services/reports-module-services/aging-report-service/aging-report.service';
import { ScreenType, OperationConstants, ScreenConstants } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { DropDownType, ListWidgetData } from '../../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2-interface';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-aging-report-operational-bills',
  templateUrl: './aging-report-operational-bills.component.html',
  styleUrls: ['./aging-report-operational-bills.component.scss']
})
export class AgingReportOperationalBillsComponent implements OnInit {
  apiError = '';
  currency_type: any;
  screenName = "ageing_bills"
  storeData = [];
  prefixUrl = '';
  isLoading=false;
  tabSelectionList: Array<DropDownType> = [
    {
      label: "All Expense bills Aging Report",
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
  screenType = ScreenType;
  analyticsType = OperationConstants;
  analyticsScreen = ScreenConstants;
  listQueryParams = {
    next_cursor: '',
    search: '',
    status: '0',
    filters: '[]',
    export:false,
  }
  filterUrl='operation/ageing_bills/filters/'
  constructor(private _agingReport: AgingReportService, private currency: CurrencyService, private _viewDetailsService: getSetViewDetails,
    private _prefixUrl: PrefixUrlService, private _route: Router, private _analytics: AnalyticsService,private _fileDownload:FileDownLoadAandOpen,
  ) { }

  ngOnInit() {
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.AGINGREPORTSOPERATIONALBILLS,this.screenType.VIEW,"Navigated");
    this.currency_type = this.currency.getCurrency();
    this.prefixUrl = this._prefixUrl.getprefixUrl();
    this.getAgingReport(this.listQueryParams)
  }

  getAgingReport(params) {
    this._agingReport.getAgingReportBills(params).subscribe(data => {
      this.storeData = data['result'].bills;
      params.next_cursor = data['result'].next_cursor;
    })
  }

  routeToScreens(id, type, data) {

    let screens = [
    {
      name: 'Vehicle Provider',
      url: '/trip/vehicle-payment/list'
    },
    {
      name: 'Fuel',
      url: '/expense/fuel_expense/list'
    },
    {
      name: 'Others',
      url: '/expense/others_expense/list'
    },
    {
      name: 'Inventory new',
      url: '/inventory/list/inventory-new'
    }];
    let viewable_attr = {
      id: id,
      screen: "",
      sub_screen: ""
    }
    this._viewDetailsService.viewInfo = viewable_attr;
    let queryParams= new Object({
      pdfViewId : id
    })
    this._route.navigate([this.prefixUrl+screens.filter(items => items.name == type)[0].url],{queryParams})
  }

  exportXls(e) {
    let params=cloneDeep(this.listQueryParams)
    delete params.next_cursor;
    params.export=true
    this._agingReport.getAgingReportOperationsExport(params).subscribe(resp => {
      let filename = this.screenName + "_" + this.tabSelectionList[params.status].label
      let type = 'xlsx'
      let fileName = filename + '.' + type;
      this._fileDownload.writeAndOpenFile(resp, fileName).then(data => {
      });
    })
  }

  listWidgetData(widgetData: ListWidgetData) {
    this.listQueryParams.filters=JSON.stringify(widgetData.filterKeyData);
    this.listQueryParams.search=widgetData.searchValue;
    this.listQueryParams.status=widgetData.tabSelection;
    this.listQueryParams.next_cursor='';
    this.getAgingReport(this.listQueryParams)
  }

  onScroll(event) {
    const container = document.querySelector('.custom-table-container');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoading && this.listQueryParams.next_cursor?.length > 0) {
      this.onScrollAgingReport(this.listQueryParams);
    }
  }

  onScrollAgingReport(params){
    this.isLoading = true;
    this._agingReport.getAgingReportBills(params).subscribe(data => {
      this.storeData.push(...data['result'].bills)
      params.next_cursor = data['result'].next_cursor;
      this.isLoading = false;
    })
  }

}


