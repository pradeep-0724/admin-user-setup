import { EmployeeSalaryModuleService } from '../../../api-services/employee-salary-service/employee-salary-module-service.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import {  PrefixUrlService, getPrefix } from 'src/app/core/services/prefixurl.service';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import moment from 'moment';
import { cloneDeep } from 'lodash';
import { ListWidgetData } from '../../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2-interface';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-list-view-employee-salary',
  templateUrl: './list-view-employee-salary.component.html',
  styleUrls: ['./list-view-employee-salary.component.scss'],
  host: {
    '(document:click)': 'outSideClick($event)'
  }
})
export class ListViewEmployeeSalaryComponent implements OnInit,OnDestroy,AfterViewChecked {
  fleetOwnerDetailId=''
  EmployeeExpenseData: any=[];
  allData: any = [];
  showOptions: string = '';
  selectedId='';
  goThroughDetais = {
    show: false,
    url: "https://demo.arcade.software/JeuDeZTbyrJNEN0Da6fp?embed%22"
  }

  popupInputData = {
    'msg': 'Are you sure, you want to delete?',
    'type': 'warning',
    'show': false
  }
  popupOutputData: any;
  listIndexData = {};
  apiError: String = "";
  routeToDetail: Boolean;
  employeeSalaryId = new BehaviorSubject('');
  currency_type;
  employeePermission = Permission.employee_salary.toString().split(',');
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;
  screenType=ScreenType;
  openListDetails=new BehaviorSubject(false)
  prefixUrl = getPrefix();
  buttonData: any = {
    name: 'Add Salaries',
    permission: Permission.employee_salary.toString().split(',')[0],
    url: this.prefixUrl + '/expense/salary_expense/add'
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
  listUrl = '/expense/salary_expense/list';
  filterUrl = 'employee/salary/filters/';
  isLoading = false;
  salariesList=[];

  constructor(private apiHandler:ApiHandlerService,private _setHeight:SetHeightService, private currency:CurrencyService, private _employeeSalaryService :EmployeeSalaryModuleService,private _analytics:AnalyticsService,
    private _route:Router, private _prefixUrl:PrefixUrlService,private _popupBodyScrollService:popupOverflowService, private _activateRoute:ActivatedRoute,
    private _router:Router,private commonloaderservice : CommonLoaderService) { }

  ngOnDestroy(): void {
    this.commonloaderservice.getShow();
  }
  ngAfterViewChecked(): void {
    this._setHeight.setTableHeight2(['.calc-height'],'salary-list',0)
  }


  ngOnInit() {
    setTimeout(() => {
      this.commonloaderservice.getHide();
    }, 300);
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.EMPLOYEESALARYBILL,this.screenType.LIST,"Navigated");
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
 openGothrough(){
    this.goThroughDetais.show=true;
}

  getTripList(params) {
    this.listQueryParams.next_cursor = '';
    this._employeeSalaryService.getEmployeeSalary(params).subscribe((data) => {
      const container = document.querySelector('.fuel-list-wrap');
      container.scrollTo(0,0);      
      this.salariesList = data['result'].es;
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
    this._employeeSalaryService.getEmployeeSalary(params).subscribe(data => {
      this.salariesList.push(...data['result'].es);
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

  routeToDetailById(id) {
    this.employeeSalaryId.next(id);
    this.routeToDetail = true;
    this.selectedId=id;
    this.openListDetails.next(true);
  }


  deleteEmployee(id) {
    this.apiHandler.handleRequest(this._employeeSalaryService.deleteEmployeeSalary(id),'Salary deleted successfully!').subscribe(
      {
        next: (resp) => {
          this._analytics.addEvent(this.analyticsType.DELETED,this.analyticsScreen.EMPLOYEESALARYBILL)
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


  outSideClick(env) {
    try {
      if ((env.target.className).indexOf('more-icon') == -1){
        this.showOptions = ''
      }
    } catch (error) {
    }
  }

  optionsList(list_index) {
     this.showOptions = list_index;
  }


  popupFunction(id, index: any = null) {
    this.listIndexData = { 'id': id, 'index': index };
    this.popupInputData['show'] = true;
    this._popupBodyScrollService.popupActive()
  }

  confirmButton(event) {
    if (event) {
      let id = this.listIndexData['id'];
      this.deleteEmployee(id);
      this.listIndexData = {};
    }
  }

  edit(id){
    this._route.navigate([this.prefixUrl+'/expense/salary_expense/edit/'+id])
  }

}
