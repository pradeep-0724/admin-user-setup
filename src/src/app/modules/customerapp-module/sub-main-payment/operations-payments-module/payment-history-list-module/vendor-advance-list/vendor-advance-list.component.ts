import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { OperationsPaymentService } from '../../../../api-services/payment-module-service/payment-service/operations-payments.service';
import { BehaviorSubject } from 'rxjs';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { getPrefix, PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import moment from 'moment';
import { cloneDeep } from 'lodash';
import { ListWidgetData } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2-interface';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';
import { formatNumber } from 'src/app/shared-module/pipes/numberformat.pipe';

@Component({
  selector: 'app-payment-advance',
  templateUrl: './vendor-advance-list.component.html',
  styleUrls: ['./vendor-advance-list.component.scss'],
  host: {
    '(document:click)': 'outSideClick($event)',
  }
})
export class VendorAdvanceListComponent implements OnInit , OnDestroy,AfterViewChecked{

  currency_type;
  routeToDetail:Boolean=false;
  goThroughDetais = {
    show: false,
    url: "https://demo.arcade.software/t8G3DmKDjNa3qOAsL5ka?embed%22"
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
  vendorAdvanceId = new BehaviorSubject('') ;
	defaultDownload: boolean = false;
  vendorAdvancePermission = Permission.vendor_advance.toString().split(',');
  selectedId='';
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;
  screenType=ScreenType;
  prefixUrl = getPrefix();
    buttonData: any = {
      name: 'Add Vendor Advance',
      permission: Permission.vendor_advance.toString().split(',')[0],
      url: this.prefixUrl + '/payments/advance'
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
      label : ''
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
    listUrl = '/payments/list/advance';
    filterUrl = 'operation/payment_made/filters/';
    isLoading = false;
    vendorAdvanceList=[]
    vendorAdvanceNumber = '';

  constructor(private _setHeight:SetHeightService,private _operationService: OperationsPaymentService,private currency:CurrencyService,
    private _prefixUrl:PrefixUrlService, private _popupBodyScrollService:popupOverflowService,private _analytics:AnalyticsService,private _activateRoute:ActivatedRoute,private _router:Router,
    private commonloaderservice: CommonLoaderService,private apiHandler: ApiHandlerService,) { }

  ngOnInit() {
    setTimeout(() => {
      this.commonloaderservice.getHide()
    }, 350);
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.ADVANCEBILL,this.screenType.LIST,"Navigated");
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
  ngAfterViewChecked(): void {
    this._setHeight.setTableHeight2(['.calc-height'],'vendor-advance',0)
  }


  ngOnDestroy(): void {
    this.commonloaderservice.getShow()
  }

  getTripList(params) {
    this.listQueryParams.next_cursor = '';
    const container = document.querySelector('.fuel-list-wrap');
    container.scrollTo(0,0)
    this._operationService.getVendorAdvanceList(params).subscribe((data) => {
      this.vendorAdvanceList = data['result'].va;
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
      label : queryParams['label'],

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
        label :widgetData.dateRange.selectedOpt
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
    this._operationService.getVendorAdvanceList(params).subscribe(data => {
      this.vendorAdvanceList.push(...data['result'].va);
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


  deleteVendorAdvance(advance_id) {
    this.apiHandler.handleRequest(this._operationService.deleteVendorAdvance(advance_id),`${this.vendorAdvanceNumber} deleted successfully!`).subscribe(
			{
				next: () => {
					this.listQueryParams.next_cursor = '';
          this._analytics.addEvent(this.analyticsType.DELETED,this.analyticsScreen.ADVANCEBILL)
          this.getTripList(this.listQueryParams)
				  },
				  error: () => {
				  },
			}
		)
    this.popupInputData['show'] = false;
  }


  optionsList(list_index) {
     this.showOptions = list_index;
  }
  openGothrough(){
    this.goThroughDetais.show=true;
}
  outSideClick(env) {
    if ((env.target.className).indexOf('more-icon') == -1)
      this.showOptions = ''
  }

  paidAmount(amount, balance) {
    return formatNumber(amount - balance);
  }


  popupFunction(data, index: any = null) {
    this.vendorAdvanceNumber = data.advance_number;
    this.listIndexData = { 'id': data.id, 'index': index };
    this.popupInputData['show'] = true;
    this._popupBodyScrollService.popupActive();
  }

  confirmButton(event) {
    if (event) {
      let id = this.listIndexData['id'];
      this.deleteVendorAdvance(id);
      this.listIndexData = {};
    }
  }


  routeToDetailById(id){
    this.vendorAdvanceId.next(id);
    this.routeToDetail = true;
    this.selectedId=id;
    // this.defaultDownload = download;

  }
  onClickCancel(){
    this.routeToDetail = false;
  }

}
