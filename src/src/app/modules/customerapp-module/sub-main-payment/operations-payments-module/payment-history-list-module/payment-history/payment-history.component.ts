import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { OperationsPaymentService } from '../../../../api-services/payment-module-service/payment-service/operations-payments.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { getPrefix, PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';

import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import moment from 'moment';
import { cloneDeep } from 'lodash';
import { ListWidgetData } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2-interface';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';
@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss'],
  host: {
    '(document:click)': 'outSideClick($event)',
  }
})
export class PaymentHistoryComponent implements OnInit ,OnDestroy,AfterViewChecked {
  bill_payment =Permission.bill_payment.toString().split(',');
  currency_type;
  goThroughDetais = {
    show: false,
    url: "https://demo.arcade.software/yHgEG86oyq4uNRMAUly2?embed%22"
  }

  popupInputData = {
    'msg': 'Are you sure, you want to delete?',
    'type': 'warning',
    'show': false
  }
  popupOutputData: any;
  listIndexData = {};
  apiError: String = "";
  showOptions: string = '';
  isFilterApplied=false;
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;
  screenType=ScreenType;
  routeToDetail:Boolean=false;
  billId = new BehaviorSubject('') ;
  selectedId ='';
  prefixUrl = getPrefix();
    buttonData: any = {
      name: 'Add Bill Payment',
      permission: Permission.bill_payment.toString().split(',')[0],
      url: this.prefixUrl + '/payments/bill'
    };
  
  start_date = moment().subtract(30, 'days').format('YYYY-MM-DD');
  end_date = moment().format('YYYY-MM-DD')
  defaultParams = {
      start_date: null,
      end_date: null,
      next_cursor: '',
      search: '',
      status: '0',
      filters: '[]',
      label : '',
    };
  listQueryParams = {
      start_date: null,
      end_date: null,
      next_cursor: '',
      search: '',
      status: '0',
      filters: '[]',
      label : ''
    }
  listUrl = '/payments/list/bill';
  filterUrl = 'operation/bill_payment/filters/';
  isLoading = false;
  billPaymentsList=[] 
  paymentNumber = '';

  constructor(private _setHeight:SetHeightService,private _operationService: OperationsPaymentService,private currency:CurrencyService,private _analytics:AnalyticsService,
    private _prefixUrl:PrefixUrlService, private _popupBodyScrollService:popupOverflowService, private _activateRoute:ActivatedRoute,private apiHandler: ApiHandlerService,
    private _router:Router,private commonloaderservoice : CommonLoaderService) { }

  ngOnDestroy(): void {
    this.commonloaderservoice.getShow();
  }
  ngAfterViewChecked(): void {
    this._setHeight.setTableHeight2(['.calc-height'],'pay-history-table',0)
  }


  ngOnInit() {
    this.commonloaderservoice.getHide()
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.PAYMENTBILL,this.screenType.LIST,"Navigated");
      this.prefixUrl = this._prefixUrl.getprefixUrl();
      this.currency_type = this.currency.getCurrency();
    this._activateRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('selectedTab') && !paramMap.has('pdfViewId')) {
        this.routeToDetail = false;
        this.selectedParamsTripList()
      } else if (paramMap.has('pdfViewId') && paramMap.has('selectedTab')) {
        this.selectedParamsTripList()
        this.routeToDetailById(paramMap['params']['pdfViewId']);
      }
      else if (paramMap.has('pdfViewId') && !paramMap.has('selectedTab')) {
        this.getTripList(this.listQueryParams);
        this.routeToDetailById(paramMap['params']['pdfViewId']);
      }
      else {
        this.routeToDetail = false;
        this.listQueryParams = cloneDeep(this.defaultParams)
        this.getTripList(this.listQueryParams);

      }
    });
  }

  getTripList(params) {
    this.listQueryParams.next_cursor = '';
    this._operationService.getPaymentHistory(params).subscribe((data) => {
      const container = document.querySelector('.fuel-list-wrap');
      container.scrollTo(0,0)
      this.billPaymentsList = data['result'].bp;
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
        label : widgetData.dateRange.selectedOpt
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
    this._operationService.getPaymentHistory(params).subscribe(data => {
      this.billPaymentsList.push(...data['result'].bp);
      params.next_cursor = data['result'].next_cursor;
      this.isLoading = false;
    })
  }

 openListDetailsData(e) {
    this.routeToDetail = !this.routeToDetail;
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

  deleteBillPayment(payment_id) {
    this.apiHandler.handleRequest(this._operationService.deleteBillPayment(payment_id),`${this.paymentNumber} deleted successfully!`).subscribe(
			{
				next: () => {
          this.listQueryParams.next_cursor='';
					this._analytics.addEvent(this.analyticsType.DELETED,this.analyticsScreen.PAYMENTBILL)
          this.getTripList(this.listQueryParams)
				  },
				  error: () => {
				  },
			}
		)
    this.popupInputData['show'] = false;
  }


  optionsList( list_index) {
     this.showOptions = list_index;
  }

  outSideClick(env) {
    if ((env.target.className).indexOf('more-icon') == -1)
      this.showOptions = ''
  }



  popupFunction(data, index: any = null) {
    this.paymentNumber = data.payment_no
    this.listIndexData = { 'id': data.id, 'index': index };
    this.popupInputData['show'] = true;
    this._popupBodyScrollService.popupActive();
  }

  confirmButton(event) {
    if (event) {
      let id = this.listIndexData['id'];
      this.deleteBillPayment(id);
      this.listIndexData = {};
    }
  }
  openGothrough(){
    this.goThroughDetais.show=true;
}

  routeToDetailById(id){
    this.routeToDetail = true;
    this.billId.next(id);
     this.selectedId=id;
  }
  onClickCancel(){
    this.routeToDetail = false;
  }


}
