import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { RouteSummaryService } from '../../api-services/reports-module-services/route-summary-service/route-summary.service';
import { compare } from 'src/app/shared-module/utilities/helper-utils';
import { Sort } from '@angular/material/sort';
import { ScreenType, OperationConstants, ScreenConstants } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';

@Component({
  selector: 'app-route-summary',
  templateUrl: './route-summary.component.html',
  styleUrls: ['./route-summary.component.scss']
})
export class RouteSummaryComponent implements OnInit {
  allData: any = [];
  storedData: any = [];
  selectedRange: Date[];
  p: number = 1;
  search = ''
  filter_by: number = 5;
  filter = new ValidationConstants().filter;
  showOptions: string = '';
  showFilter: boolean = false;
  options: any = {
    columns: [
      {
        title: 'Vehicle',
        key: 'vehicle',
        type: 'unique'
      },
      {
        title: 'Loop ID',
        key: 'loop_id',
        type: 'unique'
      },
      {
        title: 'Trip ID',
        key: ['trips', 'trip_id'],
        type: 'unique'
      },
      {
        title: 'Bilty No',
        key: ['trips', 'builty_no'],
        type: 'unique'
      },
      {
        title: 'Customer',
        key: ['trips', 'customer.company_name'],
        type: 'unique'
      },
      {
        title: 'From',
        key: ['trips', 'from_loc.name'],
        type: 'unique'
      },
      {
        title: 'To',
        key: ['trips', 'to_loc.name'],
        type: 'unique'
      },
      {
        title: 'Trip Status',
        key: ['trips', 'status'],
        type: 'unique'
      },
      {
        title: 'Loop Status',
        key: 'route_status',
        type: 'unique'
      }

    ]
  };
  popupInputData = {
    'msg': 'Are you sure, you want to delete?',
    'type': 'warning',
    'show': false
  }
  popupOutputData: any;
  listIndexData = {};
  apiError: String = "";
  isFilterApplied = false;
  prefixUrl = '';
  endDate = '';
  startDate = '';
  dateParams;
  date = new Date(dateWithTimeZone());
  isMobile = false;
  screenType = ScreenType;
  analyticsType = OperationConstants;
  analyticsScreen = ScreenConstants;

  constructor(private _analytics:AnalyticsService,
    private _routeSummaruy: RouteSummaryService,private _fileDownload:FileDownLoadAandOpen,
    private deviceService: DeviceDetectorService,
    private _route: Router,
    private _prefixUrl: PrefixUrlService
  ) { }

  ngOnInit() {
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.ROUTESUMMARY,this.screenType.VIEW,"Navigated");
    this.isMobile = this.deviceService.isMobile();
    this.prefixUrl = this._prefixUrl.getprefixUrl();
    this.date = new Date(dateWithTimeZone())
    this.endDate = moment(this.date).format('YYYY-MM-DD');
    this.startDate = moment(this.date).subtract(7, 'days').format('YYYY-MM-DD');
    this.selectedRange = [new Date(this.startDate), new Date(this.endDate)];
  }

  filterApplied(result) {
    this.storedData = result.filtedData;
    this.showFilter = !this.showFilter;
    this.isFilterApplied = result.isFilterApplied;
  }

  filterDate(dateRange) {
    if (dateRange && dateRange.length > 0) {
      this.dateParams = {
        start_date: changeDateToServerFormat(dateRange[0].toString()),
        end_date: changeDateToServerFormat(dateRange[1].toString())
      }
      this.startDate = changeDateToServerFormat(dateRange[0].toString());
      this.endDate = changeDateToServerFormat(dateRange[1].toString());
      this.getRouteSummary();
    }
  }


  getRouteSummary() {
    this._routeSummaruy.getRouteSummary(this.startDate, this.endDate).subscribe(data => {
      this.allData = data['result'];
      this.storedData = data['result'];
    })
  }

  exportXls() {
    this._routeSummaruy.getRouteSummaryExcel(this.startDate, this.endDate).subscribe(resp => {
      let type = 'xlsx'
      let fileName = 'Route_Sumamry_' + this.startDate + "_" + this.endDate + '.' + type;
      this._fileDownload.writeAndOpenFile(resp, fileName).then(data => {
      });

    })
  }

  routeToTripView(id) {
    let queryParms='?pdfViewId='+id
    let url = this.prefixUrl+"/trip/new-trip/list" +queryParms;
    this._route.navigateByUrl(url);

  }

  sortData(sort: Sort) {
    const data = this.storedData.slice();
    if (!sort.active || sort.direction === '') {
      this.storedData = data;
      return;
    }
    this.storedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'date':
          return compare(a.loop_date, b.loop_date, isAsc);
        default:
          return 0;
      }
    });
  }

}
