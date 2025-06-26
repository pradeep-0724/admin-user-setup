import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { PrefixUrlService, getPrefix } from 'src/app/core/services/prefixurl.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import moment from 'moment';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ListWidgetData } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2-interface';
import { cloneDeep } from 'lodash';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { VendorBillService } from '../vendor-bill.service';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';


@Component({
  selector: 'app-all-vendor-bill-list',
  templateUrl: './all-vendor-bill-list.component.html',
  styleUrls: ['./all-vendor-bill-list.component.scss'],
})
export class AllVendorBillListComponent implements OnInit , OnDestroy,AfterViewChecked{

  refundData=[];
  apiError: String = "";
  currency_type;
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;
  screenType=ScreenType;
  prefixUrl = getPrefix();
   start_date = moment().subtract(30, 'days').format('YYYY-MM-DD');
    end_date = moment().format('YYYY-MM-DD')
    defaultParams = {
      start_date: null,
      end_date: null,
      next_cursor: '',
      filters: '[]',
      label : ''
    };
    listQueryParams = {
      start_date:null,
      end_date: null,
      next_cursor: '',
      filters: '[]',
      label : ''
    }
    listUrl = '/reports/overall/all-vendor-bill';
    filterUrl = 'operation/vendor_bill/filters/';
    isLoading = false;
  constructor(private _setHeight:SetHeightService,private _vendor_bill_service:VendorBillService,private _analytics:AnalyticsService,private currency:CurrencyService, private _prefixUrl:PrefixUrlService,
    private _activateRoute:ActivatedRoute,private _router:Router,private commonloaderservice : CommonLoaderService,private _fileDownload: FileDownLoadAandOpen) { }

  ngOnDestroy(): void {
    this.commonloaderservice.getShow();
  }

  ngAfterViewChecked(): void {
    this._setHeight.setTableHeight2(['.calc-height'],'vendor-bill-table',0)
  }

  ngOnInit() {
    setTimeout(() => {
      this.commonloaderservice.getHide();
    }, 400);
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.ALLVENDORBILL,this.screenType.LIST,"Navigated");
    this.prefixUrl = this._prefixUrl.getprefixUrl();
    this.currency_type = this.currency.getCurrency();
    this._activateRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('selectedTab') && !paramMap.has('pdfViewId')) {
        this.selectedParamsBillList()
      }
      else {
        this.listQueryParams = cloneDeep(this.defaultParams)
        this.getBillList(this.listQueryParams);

      }
    });
  }
  getBillList(params) {
    console.log(1)
    this.listQueryParams.next_cursor = '';
    this._vendor_bill_service.getVendorBillList(params).subscribe((data) => {
      const container = document.querySelector('.vendor-bill-list-wrap');
      container.scrollTo(0,0)
      this.refundData = data['result']?.bill;
      params.next_cursor = data['result'].next_cursor;
    });
  }
  exportList(e) {
    let params = cloneDeep(this.listQueryParams)
    params['is_export'] = true
    delete params['next_cursor']
    let fileName = "All Vendor Bill List" + '.' + 'xlsx';
    if (e)
      this._vendor_bill_service.downloadVendorBillList(params).subscribe((data) => {
        this._fileDownload.writeAndOpenFile(data, fileName).then(resp => {
         
        });
      });
  }

  createQueryParems(id) {
    let queryParams = new Object(
      {
        start_date: this.listQueryParams.start_date,
        end_date: this.listQueryParams.end_date,
        filter: this.listQueryParams.filters,
        pdfViewId: id,
        label : this.listQueryParams.label
      }
    );
    this._router.navigate([getPrefix() + this.listUrl], { queryParams });
  }

  selectedParamsBillList() {
    const queryParams = this._activateRoute.snapshot.queryParams;
    this.listQueryParams = {
      start_date: changeDateToServerFormat(queryParams['start_date']),
      end_date: changeDateToServerFormat(queryParams['end_date']),
      next_cursor: '',
      filters: queryParams['filter'],
      label: queryParams['label']
      

    }
    this.getBillList(this.listQueryParams);
  }

 listWidgetData(widgetData: ListWidgetData) {
    let queryParams = new Object(
      {
        selectedTab: widgetData.tabSelection,
        start_date: widgetData.dateRange.startDate,
        end_date: widgetData.dateRange.endDate,
        filter: JSON.stringify(widgetData.filterKeyData),
        label: widgetData.dateRange.selectedOpt
      }
    );
    this._router.navigate([getPrefix() + this.listUrl], { queryParams });
  }

  onScroll(event) {
    const container = document.querySelector('.vendor-bill-list-wrap');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoading && this.listQueryParams.next_cursor?.length > 0) {
      this.onScrollGetTripList(this.listQueryParams);
    }
  }

  onScrollGetTripList(params) {
    this.isLoading = true;
    this._vendor_bill_service.getVendorBillList(params).subscribe(data => {
      this.refundData.push(...data['result'].bill);
      params.next_cursor = data['result'].next_cursor;
      this.isLoading = false;
    })
  }

 openListDetailsData(e) {
    let queryParams = new Object(
      {
        start_date: this.listQueryParams.start_date,
        end_date: this.listQueryParams.end_date,
        filter: this.listQueryParams.filters,
        label : this.listQueryParams.label
      }
    );
    this._router.navigate([getPrefix() + this.listUrl], { queryParams });
    }
}
