import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { OperationsActivityService } from '../../../api-services/operation-module-service/operations-activity.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { BehaviorSubject } from 'rxjs';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { getPrefix, PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import moment from 'moment';
import { cloneDeep } from 'lodash';
import { ListWidgetData } from '../../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2-interface';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-list-other-activity',
  templateUrl: './list-other-activity.component.html',
  styleUrls: ['./list-other-activity.component.scss'],
  host: {
    '(document:click)': 'outSideClick($event)',
  }
})
export class ListOtherActivityComponent implements OnInit,OnDestroy ,AfterViewChecked{

  currency_type;
  showOptions: string = '';
  routeToDetail:Boolean;
  OtherExpenseDetailId = new BehaviorSubject('') ;
  goThroughDetais = {
    show: false,
    url: "https://demo.arcade.software/SIoQhrEnNXg1aiCjLwwE?embed%22"
  }
 
  popupInputData = {
		'msg': 'Are you sure, you want to delete?',
		'type': 'warning',
		'show': false
	}
	listIndexData = {};
	apiError: String = "";
  selectedId='';
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;
  screenType=ScreenType;
  openListDetails=new BehaviorSubject(false)
  otherPermission=Permission.others.toString().split(',');
  prefixUrl = getPrefix();
  tabSelectionList: Array<any> = [
      {
        label: "All Other Bills",
        value: "0",
      },
      {
        label: "Paid Bills",
        value: "3",
      },
      {
        label: "Unpaid Bills",
        value: "1",
      },
      {
        label: "Partially Paid Bills",
        value: "2",
      },
  
    ];
    buttonData: any = {
      name: 'Add Other Bills',
      permission: Permission.others.toString().split(',')[0],
      url: this.prefixUrl + '/expense/others_expense/add'
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
    listUrl = '/expense/others_expense/list';
    filterUrl = 'operation/otheractivity/filters/';
    isLoading = false;
    otherBillsList=[];
    otherBillsNumber = '';
    billNumber = '';
  constructor(private apiHandler:ApiHandlerService,private _setHeight:SetHeightService,private _operationService: OperationsActivityService,private _analytics:AnalyticsService,private currency:CurrencyService,
    private _prefixUrl:PrefixUrlService, private _popupBodyScrollService:popupOverflowService,
    private _activateRoute:ActivatedRoute, private _router:Router,private commmonloaderservice :CommonLoaderService) { }

  ngOnDestroy(): void {
    this.commmonloaderservice.getShow()

  }
  ngAfterViewChecked(): void {
    this._setHeight.setTableHeight2(['.calc-height'],'other-list',0)
  }


  ngOnInit() {
    setTimeout(() => {
      this.commmonloaderservice.getHide()
    }, 400);
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.OTHERSBILL,this.screenType.LIST,"Navigated");
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
    this._operationService.getOthersList(params).subscribe((data) => {
      const container = document.querySelector('.fuel-list-wrap');
      container.scrollTo(0,0)
      this.otherBillsList = data['result'].ob;
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
    this._operationService.getOthersList(params).subscribe(data => {
      this.otherBillsList.push(...data['result'].ob);
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


  routeToDetailById(id){
  this.OtherExpenseDetailId.next(id);
  this.routeToDetail = true;
  this.selectedId=id;

}
openGothrough(){
  this.goThroughDetais.show=true;
}

  deleteOtherActivity(activity_id) {
    this.apiHandler.handleRequest(this._operationService.deleteOtherActivity(activity_id),` ${this.billNumber} deleted successfully!`).subscribe(
      {
        next: (resp) => {
          this._analytics.addEvent(this.analyticsType.DELETED,this.analyticsScreen.OTHERSBILL)
          this.getTripList(this.listQueryParams)
          },
          error: (error) => {
            this.apiError = error['error']['message'];
        this.popupInputData['show'] = false;
        setTimeout(() => {
          this.apiError = '';
        }, 10000);
          },
      }
    )
  }


  optionsList(list_index) {
     this.showOptions = list_index;
  }

  outSideClick(env) {
    try {
      if ((env.target.className).indexOf('more-icon') == -1){
        this.showOptions = ''
      }
    } catch (error) {
      console.log(error)
    }
  }

  popupFunction(data, index: any = null) {
    this.billNumber = data.bill_number
		this.listIndexData = { 'id': data.id, 'index': index };
		this.popupInputData['show'] = true;
    this._popupBodyScrollService.popupActive()
	}

	confirmButton(event) {
		if (event) {
			let id = this.listIndexData['id'];
			this.deleteOtherActivity(id);
			this.listIndexData = {};
		}
  }

  onClickCancel(){
    this.routeToDetail = false;
  }

}
