import { PaymentsService } from '../../../../../api-services/revenue-module-service/payment-services/payments-service.service';
import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { changeDateToServerFormat, normalDate } from 'src/app/shared-module/utilities/date-utilis';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { PrefixUrlService, getPrefix } from 'src/app/core/services/prefixurl.service';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import moment from 'moment';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ListWidgetData } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2-interface';
import { cloneDeep } from 'lodash';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';


@Component({
  selector: 'app-refund',
  templateUrl: './refund.component.html',
  styleUrls: ['./refund.component.scss'],
  host: {
    '(document:click)': 'outSideClick($event)',
  }
})
export class RefundListComponent implements OnInit , OnDestroy,AfterViewChecked{

  refundData=[];
  showOptions: string = '';
  popupInputData = {
    'msg': 'Are you sure, you want to delete?',
    'type': 'warning',
    'show': false
  }
  goThroughDetais = {
    show: false,
    url: "https://demo.arcade.software/yE4ZPSBytUTHZz1s2qUx?embed%22"
  }
  popupOutputData: any;
  listIndexData = {};
  apiError: String = "";
  currency_type;
  refundPermissions = Permission.payments__refund.toString().split(',');
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;
  screenType=ScreenType;
  prefixUrl = getPrefix();
    buttonData: any = {
      name: 'Add Refund',
      permission: Permission.payments__refund.toString().split(',')[0],
      url: this.prefixUrl + '/income/payments/refund/add'
    };
  
   start_date = moment().subtract(30, 'days').format('YYYY-MM-DD');
    end_date = moment().format('YYYY-MM-DD')
    defaultParams = {
      start_date: null,
      end_date: null,
      next_cursor: '',
      search: '',
      status: '3',
      filters: '[]',
      label : ''
    };
    listQueryParams = {
      start_date:null,
      end_date: null,
      next_cursor: '',
      search: '',
      status: '3',
      filters: '[]',
      label : ''
    }
    listUrl = '/income/payments/list/refund';
    filterUrl = 'revenue/refund_voucher/filerts/';
    isLoading = false;
    refundNumber = '';
  constructor(private _setHeight:SetHeightService,private _paymentService: PaymentsService,private _analytics:AnalyticsService,private currency:CurrencyService, private _prefixUrl:PrefixUrlService, private _popupBodyScrollService:popupOverflowService,
    private _activateRoute:ActivatedRoute,private _router:Router,private commonloaderservice : CommonLoaderService,private apiHandler: ApiHandlerService) { }

  ngOnDestroy(): void {
    this.commonloaderservice.getShow();
  }

  ngAfterViewChecked(): void {
    this._setHeight.setTableHeight2(['.calc-height'],'refund-table',0)
  }

  ngOnInit() {
    setTimeout(() => {
      this.commonloaderservice.getHide();
    }, 400);
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.REFUNDCLIENT,this.screenType.LIST,"Navigated");
    this.prefixUrl = this._prefixUrl.getprefixUrl();
    this.currency_type = this.currency.getCurrency();
    this._activateRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('selectedTab') && !paramMap.has('pdfViewId')) {
        this.selectedParamsTripList()
      }
      else {
        this.listQueryParams = cloneDeep(this.defaultParams)
        this.getTripList(this.listQueryParams);

      }
    });
  }
  getTripList(params) {
    this.listQueryParams.next_cursor = '';
    this._paymentService.getRefundVoucher(params).subscribe((data) => {
      const container = document.querySelector('.fuel-list-wrap');
      container.scrollTo(0,0)
      this.refundData = data['result'].ref;
      params.next_cursor = data['result'].next_cursor;
    });
  }

  createQueryParems(id) {
    let queryParams = new Object(
      {
        selectedTab: this.listQueryParams.status,
        start_date: this.listQueryParams.start_date,
        end_date: this.listQueryParams.end_date,
        search: this.listQueryParams.search,
        filter: this.listQueryParams.filters,
        pdfViewId: id,
        label : this.listQueryParams.label
      }
    );
    this._router.navigate([getPrefix() + this.listUrl], { queryParams });
  }

  selectedParamsTripList() {
    const queryParams = this._activateRoute.snapshot.queryParams;
    this.listQueryParams = {
      start_date: changeDateToServerFormat(queryParams['start_date']),
      end_date: changeDateToServerFormat(queryParams['end_date']),
      search: queryParams['search'],
      status: queryParams['selectedTab'],
      next_cursor: '',
      filters: queryParams['filter'],
      label: queryParams['label']
      

    }
    this.getTripList(this.listQueryParams);
  }

 listWidgetData(widgetData: ListWidgetData) {
    let queryParams = new Object(
      {
        selectedTab: widgetData.tabSelection,
        start_date: widgetData.dateRange.startDate,
        end_date: widgetData.dateRange.endDate,
        search: widgetData.searchValue,
        filter: JSON.stringify(widgetData.filterKeyData),
        label: widgetData.dateRange.selectedOpt
      }
    );
    this._router.navigate([getPrefix() + this.listUrl], { queryParams });
  }

  onScroll(event) {
    const container = document.querySelector('.fuel-list-wrap');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoading && this.listQueryParams.next_cursor?.length > 0) {
      this.onScrollGetTripList(this.listQueryParams);
    }
  }

  onScrollGetTripList(params) {
    this.isLoading = true;
    this._paymentService.getRefundVoucher(params).subscribe(data => {
      this.refundData.push(...data['result'].ref);
      params.next_cursor = data['result'].next_cursor;
      this.isLoading = false;
    })
  }

 openListDetailsData(e) {
    let queryParams = new Object(
      {
        selectedTab: this.listQueryParams.status,
        start_date: this.listQueryParams.start_date,
        end_date: this.listQueryParams.end_date,
        search: this.listQueryParams.search,
        filter: this.listQueryParams.filters,
        label : this.listQueryParams.label
      }
    );
    this._router.navigate([getPrefix() + this.listUrl], { queryParams });
    }


  outSideClick(env) {
    if ((env.target.className).indexOf('more-icon') == -1)
      this.showOptions = ''
  }

  optionsList(list_index) {
     this.showOptions = list_index;
  }
  dateChange(date) {
    return normalDate(date);
  }

  deleteRefund(refund_id) {
    this.apiHandler.handleRequest(this._paymentService.deleteRefund(refund_id), `${this.refundNumber} deleted successfully!`).subscribe(
      {
        next: () => {
          this._analytics.addEvent(this.analyticsType.DELETED, this.analyticsScreen.REFUNDCLIENT)
          this.getTripList(this.listQueryParams)
        },
        error: (error) => {
          this.apiError = error['error']['message'];
          this.popupInputData['show'] = false;
          setTimeout(() => {
            this.apiError = '';
          }, 10000);
        }
      }
    );
  }

  popupFunction(data, index: any = null) {
    this.refundNumber = data.refund_number;
    this.listIndexData = { 'id': data.id, 'index': index };
    this.popupInputData['show'] = true;
    this._popupBodyScrollService.popupActive();
  }

  confirmButton(event) {
    if (event) {
      let id = this.listIndexData['id'];
      this.deleteRefund(id);
      this.listIndexData = {};
    }
  }
  openGothrough(){
    this.goThroughDetais.show=true;
}


}
