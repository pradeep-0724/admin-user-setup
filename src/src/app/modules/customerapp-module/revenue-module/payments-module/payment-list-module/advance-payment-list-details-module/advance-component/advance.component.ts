import { PaymentsService } from '../../../../../api-services/revenue-module-service/payment-services/payments-service.service';
import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { changeDateToServerFormat, normalDate } from 'src/app/shared-module/utilities/date-utilis';
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


@Component({
  selector: 'app-advance',
  templateUrl: './advance.component.html',
  styleUrls: ['./advance.component.scss'],
  host: {
    '(document:click)': 'outSideClick($event)',
  }
})
export class AdvanceListComponent implements OnInit,OnDestroy,AfterViewChecked{

  advancePayment=[];
  showOptions: string = '';
  routeToDetail:Boolean;
  advanceDetailId = new BehaviorSubject('') ;
  popupInputData = {
    'msg': 'Are you sure, you want to delete?',
    'type': 'warning',
    'show': false
  }
  popupOutputData: any;
  listIndexData = {};
  apiError: String = "";
  currency_type;
  selectedId = '';
  advancePermissions = Permission.payments__advance.toString().split(',');
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;
  screenType=ScreenType;
  goThroughDetais = {
    show: false,
    url: "https://demo.arcade.software/DuXS47Npqb5AElbxDJn2?embed%22"
  }
  prefixUrl = getPrefix();
  tabSelectionList: Array<any> = [
      {
        label: "All Advance Bills",
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
    buttonData: any = {
      name: 'Add Advance',
      permission: Permission.payments__advance.toString().split(',')[0],
      url: this.prefixUrl + '/income/payments/advance/add'
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
    listUrl = '/income/payments/list/advance';
    filterUrl = 'revenue/customer_advance/filters/';
    isLoading = false;
    advanceNumber = '';
  constructor(private _setHeight:SetHeightService,private _paymentService: PaymentsService,private _analytics:AnalyticsService,private currency:CurrencyService,private _prefixUrl:PrefixUrlService, private _popupBodyScrollService:popupOverflowService,private _activateRoute:ActivatedRoute,
    private _router:Router,private commonloaderservice :CommonLoaderService,private apiHandler: ApiHandlerService) { }

  ngOnDestroy(): void {
    this.commonloaderservice.getShow()
  }
  ngAfterViewChecked(): void {
    this._setHeight.setTableHeight2(['.calc-height'],'advance-list',0)
  }


  ngOnInit() {
    setTimeout(() => {
      this.commonloaderservice.getHide();
    }, 400);
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.ADVANCECLIENT,this.screenType.LIST,"Navigated");
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
    this._paymentService.getCustomerAdvance(params).subscribe((data) => {
      const container = document.querySelector('.fuel-list-wrap');      
      container.scrollTo(0,0)
      this.advancePayment = data['result'].adv;
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
    this._paymentService.getCustomerAdvance(params).subscribe(data => {
      this.advancePayment.push(...data['result'].adv);
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


  outSideClick(env) {
    if ((env.target.className).indexOf('more-icon') == -1)
      this.showOptions = ''
  }
  optionsList(list_index) {
     this.showOptions = list_index;
  }
  openGothrough(){
    this.goThroughDetais.show=true;
  }

  dateChange(date){
    return normalDate(date)
  }



  deleteAdvanceList(advance_id) {
    this.apiHandler.handleRequest(this._paymentService.deleteAdvance(advance_id), `${this.advanceNumber} deleted successfully!`).subscribe(
      {
        next: () => {
          this._analytics.addEvent(this.analyticsType.DELETED, this.analyticsScreen.ADVANCECLIENT)
          this.getTripList(this.listQueryParams)
        },
        error: error => {
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
    this.advanceNumber = data.advance_number;
    this.listIndexData = { 'id': data.id, 'index': index };
    this.popupInputData['show'] = true;
    this._popupBodyScrollService.popupActive();
  }

  confirmButton(event) {
    if (event) {
      let id = this.listIndexData['id'];
      this.deleteAdvanceList(id);
      this.listIndexData = {};
    }
  }
 
  routeToDetailById(id){
  this.advanceDetailId.next(id);
  this.routeToDetail = true;
  this.selectedId=id;
}

onClickCancel(){
  this.routeToDetail = false;
}

}
