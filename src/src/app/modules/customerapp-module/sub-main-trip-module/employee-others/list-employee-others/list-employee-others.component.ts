import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { OperationsActivityService } from '../../../api-services/operation-module-service/operations-activity.service';
import { changeDateToServerFormat, normalDate } from 'src/app/shared-module/utilities/date-utilis';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { BehaviorSubject } from 'rxjs';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import moment from 'moment';
import { cloneDeep } from 'lodash';
import { ListWidgetData } from '../../new-trip-v2/list-module-v2/list-module-v2-interface';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-list-employee-others',
  templateUrl: './list-employee-others.component.html',
  styleUrls: ['./list-employee-others.component.scss'],
  host: {
    '(document:click)': 'outSideClick($event)'
  }
})
export class ListEmployeeOthersComponent implements OnInit, OnDestroy, AfterViewChecked {

  allData = [];
  sortedData = [];
  expenseId = new BehaviorSubject('');
  showOptions: string = '';
  showFilter: boolean = false;
  routeToDetail: Boolean;
  filter = new ValidationConstants().filter;
  openListDetails = new BehaviorSubject(false)
  listIndexData = {};
  popupInputData = {
    'msg': 'Are you sure, you want to delete?',
    'type': 'warning',
    'show': false
  }
  filter_by: number = 5;
  p = 1;
  search: any;
  currency_type;
  selectedId = '';
  employeeOthersPermission = Permission.employeeOthers.toString().split(',');
  analyticsType = OperationConstants;
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  isMobile: boolean = false;
  goThroughDetais = {
    show: false,
    url: "https://demo.arcade.software/2LBh6yAcdJu1HkQhPhIS?embed%22"
  }
  start_date = moment().subtract(30, 'days').format('YYYY-MM-DD');
  end_date = moment().format('YYYY-MM-DD')
  defaultParams = {
    start_date: null,
    end_date: null,
    next_cursor: '',
    search: '',
    status: '0',
    filters: '[]',
    label: ''
  };
  listQueryParams = {
    start_date: this.start_date,
    end_date: this.end_date,
    next_cursor: '',
    search: '',
    status: '0',
    filters: '[]',
    label: ''
  }
  listUrl = '/trip/employee-others/list';
  filterUrl = 'operation/employee/other_expense/filters/';
  isLoading = false;
  prefixUrl = getPrefix()
  buttonData: any = {
    name: 'Add Employee Expense',
    permission: Permission.employeeOthers.toString().split(',')[0],
    url: this.prefixUrl + '/trip/employee-others/add'
  };
  employeeExpenseLabel = '';
  employeeExpenseList = []



  constructor(
    private _operationActivityService: OperationsActivityService,
    private currency: CurrencyService,
    private _analytics: AnalyticsService,
    private _popupBodyScrollService: popupOverflowService,
    private _activateRoute: ActivatedRoute,
    private _router: Router,
    private commonloaderservce: CommonLoaderService,
    private _setHeight: SetHeightService,
    private apiHandler: ApiHandlerService,

  ) { }
  ngOnDestroy(): void {
    this.commonloaderservce.getShow();
  }
  ngAfterViewChecked(): void {
    this._setHeight.setTableHeight2(['.calc-height'], 'employee-list', 0)

  }

  ngOnInit() {
    this.commonloaderservce.getHide()
    this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.EMPLOYEEOTHERBILL, this.screenType.LIST, "Navigated");
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
        this.listQueryParams = cloneDeep(this.defaultParams);
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
    this._operationActivityService.getOtherData(params).subscribe((data) => {
      this.employeeExpenseList = data['result'].ee;
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
        label: this.listQueryParams.label
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
    this._operationActivityService.getOtherData(params).subscribe(data => {
      this.employeeExpenseList.push(...data['result'].ee);
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
        label: this.listQueryParams.label
      }
    );
    this._router.navigate([getPrefix() + this.listUrl], { queryParams });

  }

  dateChange(date) {
    return normalDate(date);
  }

  outSideClick(env) {
    try {
      if ((env.target.className).indexOf('more-icon') == -1) {
        this.showOptions = ''
      }
    } catch (error) {
      console.log(error)
    }
  }

  optionsList(list_index) {
    this.showOptions = list_index
  }

  openGothrough() {
    this.goThroughDetais.show = true;
  }

  confirmButton(event) {
    if (event) {
      let id = this.listIndexData['id'];
      this.deleteEmployeeOther(id);
      this.listIndexData = {};
    }
  }

  deleteEmployeeOther(id) {

    this.apiHandler.handleRequest(this._operationActivityService.deleteEmployeeOthers(id),`${this.employeeExpenseLabel} deleted successfully!`).subscribe(
			{
				next: () => {
					this._analytics.addEvent(this.analyticsType.DELETED, this.analyticsScreen.EMPLOYEEOTHERBILL)
          this.listQueryParams.next_cursor=''
           this.getTripList(this.listQueryParams)
				  },
				  error: () => {
				  },
			}
		)
  }

  filterApplied(data) {
    this.sortedData = data;
  }

  popupFunction(data, index: any = null) {
    this.employeeExpenseLabel = data?.expense_type;
    this.listIndexData = { 'id': data.id, 'index': index };
    this.popupInputData['show'] = true;
    this._popupBodyScrollService.popupActive()
  }

  routeToDetailById(id: string) {
    this.expenseId.next(id)
    this.routeToDetail = true;
    this.selectedId = id;
  }
  //  createQueryParems(id){
  //   let queryParms='?pdfViewId='+id
  //   let url = getPrefix()+"/trip/employee-others/list" +queryParms;
  //   this._router.navigateByUrl(url);
  //   }

  searchFilter(e) {
    this.search = e;
  }

  filterListBy(e) {
    this.filter_by = e;
  }


  //  openListDetailsData(e){
  //   this.routeToDetail = !this.routeToDetail;
  //   let url = getPrefix()+"/trip/employee-others/list";
  //   this._router.navigateByUrl(url);
  //   if(e){
  //     this.expenseId.next(this.sortedData[0].id)
  //     this.selectedId = this.sortedData[0].id;
  //   }

  // }

}
