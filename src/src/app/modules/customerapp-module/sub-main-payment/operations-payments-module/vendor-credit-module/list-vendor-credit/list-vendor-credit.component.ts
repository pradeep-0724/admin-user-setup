import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { OperationsPaymentService } from '../../../../api-services/payment-module-service/payment-service/operations-payments.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
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
  selector: 'app-list-vendor-credit',
  templateUrl: './list-vendor-credit.component.html',
  styleUrls: ['./list-vendor-credit.component.scss'],
  host: {
    '(document:click)': 'outSideClick($event)',
  }
})
export class ListVendorCreditComponent implements OnInit, OnDestroy,AfterViewChecked {


  vendorCreditStatus: any;
  allData: any = [];
  goThroughDetais = {
    show: false,
    url: "https://demo.arcade.software/NvTpA6F3RwLmMXCTz944?embed%22"
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
  currency_type;
  vendorCreditPermission = Permission.vendor_credit.toString().split(',');
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;
  screenType=ScreenType;
  tabSelectionList: Array<any> = [
    {
      label: "All Vendor Credit Bills",
      value: "3",
    },
    {
      label: "Finalised Bills",
      value: "1",
    },
    {
      label: "Closed Bills",
      value: "2",
    },

  ];
  prefixUrl = getPrefix();
  buttonData: any = {
    name: 'Add Vendor Credit',
    permission: Permission.vendor_credit.toString().split(',')[0],
    url: this.prefixUrl + '/payments/vendor_credit/add'
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
    start_date: null,
    end_date: null,
    next_cursor: '',
    search: '',
    status: '3',
    filters: '[]',
    label : ''
  }
  listUrl = '/payments/vendor_credit/list';
  filterUrl = 'operation/vendor_credit/filters/';
  isLoading = false;
  vendorCreditList=[]
  vendorCreditNumber = '';

  constructor(private _operationService: OperationsPaymentService,private currency:CurrencyService,private _analytics:AnalyticsService,
    private _prefixUrl:PrefixUrlService, private _popupBodyScrollService:popupOverflowService,
    private _activateRoute: ActivatedRoute,
    private _setHeight:SetHeightService,private apiHandler: ApiHandlerService,
    private _router: Router,private commonloadesrvice: CommonLoaderService) { }
    
  ngOnDestroy(): void {
    this.commonloadesrvice.getShow()
  }
  ngAfterViewChecked(): void {
    this._setHeight.setTableHeight2(['.calc-height'],'vendor-credit',0)
  }


  ngOnInit() {
    setTimeout(() => {
      this.commonloadesrvice.getHide()
    }, 400);
     this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.VENDORCREDIT,this.screenType.LIST,"Navigated");
      this.prefixUrl = this._prefixUrl.getprefixUrl();
      this.currency_type = this.currency.getCurrency();
      this._activateRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has('selectedTab')) {
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
    const container = document.querySelector('.fuel-list-wrap');
    container.scrollTo(0,0)
    this._operationService.getVendorList(params).subscribe((data) => {      
      this.vendorCreditList = data['result'].vc;
      params.next_cursor = data['result'].next_cursor;
    });
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
    this._operationService.getVendorList(params).subscribe(data => {
      this.vendorCreditList.push(...data['result'].vc);
      params.next_cursor = data['result'].next_cursor;
      this.isLoading = false;
    })
  }

  openGothrough(){
    this.goThroughDetais.show=true;
}
  deleteVendorCredit(credit_id) {
    this.apiHandler.handleRequest( this._operationService.deleteVendorCredit(credit_id), `${this.vendorCreditNumber} deleted successfully!`).subscribe(
			{
				next: () => {
					this.listQueryParams.next_cursor = '';
          this._analytics.addEvent(this.analyticsType.DELETED,this.analyticsScreen.VENDORCREDIT)
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

  outSideClick(env) {
    if ((env.target.className).indexOf('more-icon') == -1)
      this.showOptions = ''
  }

  popupFunction(data, index: any = null) {
    this.vendorCreditNumber = data.vendor_credit_number
    this.listIndexData = { 'id': data.id, 'index': index };
    this.popupInputData['show'] = true;
    this._popupBodyScrollService.popupActive()

  }

  confirmButton(event) {
    if (event) {
      let id = this.listIndexData['id'];
      this.deleteVendorCredit(id);
      this.listIndexData = {};
    }
  }

}
