import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { getPrefix, PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { OperationsActivityService } from '../../../api-services/operation-module-service/operations-activity.service';
import moment from 'moment';
import { cloneDeep } from 'lodash';
import { ListWidgetData } from '../../new-trip-v2/list-module-v2/list-module-v2-interface';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-trip-expense-list',
  templateUrl: './trip-expense-list.component.html',
  styleUrls: ['./trip-expense-list.component.scss'],
  host: {
    '(document:click)': 'outSideClick($event)'
  }
})
export class TripExpenseListComponent implements OnInit,OnDestroy {
 
  showOptions: string = '';
  showFilter: boolean = false;
  routeToDetail: Boolean=false;
  currency_type;
  expenseDetailId = new BehaviorSubject('');
  goThroughDetais = {
    show: false,
    url: "https://demo.arcade.software/OsBPoLcKaxHgknPd13ht?embed%22"
  }
  start_date=moment().subtract(1,'month').format('YYYY-MM-DD');
  end_date=moment().format('YYYY-MM-DD');
  popupInputData = {
    'msg': 'Are you sure, you want to delete?',
    'type': 'warning',
    'show': false
  }
  popupOutputData: any;
  listIndexData = {};
  selectedId = '';
  search=''
  tripExpensePermission = Permission.tripexpense.toString().split(',');
  prefixUrl: string;
  isMobile = false;
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;
  screenType=ScreenType;
  openListDetails=new BehaviorSubject(false);
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
    start_date: this.start_date,
    end_date: this.end_date,
    next_cursor: '',
    search: '',
    status: '0',
    filters:'[]',
    label : ''
  };
  tabSelectionList: Array<any> = [
    {
      label: "All Job Expense Bills",
      value: "0",
    },
    {
      label: "Paid Job Expense Bills",
      value: "1",
    },
    {
      label: "Unpaid Job Expense Bills",
      value: "2",
    },
    {
      label: "Partially Paid Job Expense Bills",
      value: "3",
    },
   
  ];
  buttonData: any = {
    name: 'Add Job Expense',
    permission: Permission.tripexpense.toString().split(',')[0],
    url: getPrefix() + '/trip/trip-expense/add'
  }
  listUrl='/trip/trip-expense/list';
  filterUrl='operation/tripexpense/filters/';
	settingsUrl = 'operation/tripexpense/setting/';
  tripExpenseListHeader = [];
  tripExpenseList=[];
  isLoading = false; 
  jobExpenseLabel = '';

  constructor(private _setHeight:SetHeightService,private _operationService: OperationsActivityService, private currency: CurrencyService,
    private _prefixUrl: PrefixUrlService, private _commonloaderservice :CommonLoaderService,private _analytics:AnalyticsService,
     private _popupBodyScrollService:popupOverflowService,private _activateRoute:ActivatedRoute,
     private _router:Router,private _fileDownload: FileDownLoadAandOpen,private apiHandler: ApiHandlerService,
    ) { }
     
  ngOnDestroy(): void {
    this._commonloaderservice.getShow()
  }
  ngAfterViewChecked(): void {
   
    this._setHeight.setTableHeight2(['.calc-height'],'trip-expense-list',0); 
}

  ngOnInit() {
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.TRIPEXPENSEBILL,this.screenType.LIST,"Navigated");
      this.prefixUrl = this._prefixUrl.getprefixUrl();
      this.currency_type = this.currency.getCurrency();
        this._commonloaderservice.getHide()
    this._activateRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("selectedTab") && !paramMap.has("pdfViewId")) {
        this.routeToDetail = false;
        this.selectedParamsTripExpList();
      } else if (paramMap.has("pdfViewId") && paramMap.has("selectedTab")) {
        this.selectedParamsTripExpList();
        this.routeToDetailById(paramMap["params"]["pdfViewId"]);
      } else if (paramMap.has("pdfViewId") && !paramMap.has("selectedTab")) {
        this.listQueryParams = cloneDeep(this.defaultParams); 
        this.getTripExpList(this.listQueryParams);
        this.routeToDetailById(paramMap["params"]["pdfViewId"]);
      } else {
        this.routeToDetail = false;
        this.listQueryParams = cloneDeep(this.defaultParams);
        this.getTripExpList(this.listQueryParams);
      }
    })
  }
  openGothrough(){
    this.goThroughDetais.show=true;
  }


  routeToDetailById(id) {
    this.expenseDetailId.next(id);
    this.routeToDetail = true;
    this.selectedId = id;
  }
  createQueryParems(id) {
    let queryParams = new Object({
      selectedTab: this.listQueryParams.status,
      start_date: this.listQueryParams.start_date,
      end_date: this.listQueryParams.end_date,
      search: this.listQueryParams.search,
      filter: this.listQueryParams.filters,
      pdfViewId: id,
      label : this.listQueryParams.label
    });
    this._router.navigate([getPrefix() + this.listUrl], { queryParams });
  }

  deleteMechanic(mechanic_id) {

    this.apiHandler.handleRequest(this._operationService.deleteTripExpense(mechanic_id),`${this.jobExpenseLabel} deleted successfully!`).subscribe(
			{
				next: () => {
          this._analytics.addEvent(this.analyticsType.DELETED,this.analyticsScreen.TRIPEXPENSEBILL)
          this.listQueryParams.next_cursor=''
          this.getTripExpList(this.listQueryParams)
				  },
				  error: (error) => {
				  },
			}
		)
    this.popupInputData['show'] = false;
  }

  getTripExpList(params) {
    this.listQueryParams.next_cursor='';    
    this._operationService.getAllTripExpense(params).subscribe((data) => {      
      const container = document.querySelector('.trip-expense-list-wrap');
      container.scrollTo(0,0)
      this.tripExpenseList=data['result'].te;
      this.tripExpenseListHeader =data['result'].column;
      params.next_cursor = data['result'].next_cursor;
    });
  }


 selectedParamsTripExpList() {
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
    this.getTripExpList(this.listQueryParams);
  }

  listWidgetData(widgetData: ListWidgetData) {
    let queryParams = new Object(
      {
        selectedTab: widgetData.tabSelection,
        start_date: widgetData.dateRange.startDate,
        end_date: widgetData.dateRange.endDate,
        search: widgetData.searchValue,
        filter: JSON.stringify(widgetData.filterKeyData),
        label : widgetData.dateRange.selectedOpt,

      }
    );
    this._router.navigate([getPrefix() + this.listUrl], { queryParams });
  }

  onScroll(event) {
    const container = document.querySelector('.trip-expense-list-wrap');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoading && this.listQueryParams.next_cursor?.length > 0) {
      this.onScrollGetTripList(this.listQueryParams);            
    }
  }

  onScrollGetTripList(params) {
    this.isLoading = true;    
    this._operationService.getAllTripExpense(params).subscribe(data => {
      this.tripExpenseList.push(...data['result'].te);
      params.next_cursor = data['result'].next_cursor;
      this.isLoading = false;
    })
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

  optionsList(event, list_index) {
    return (this.showOptions = list_index);
  }

  popupFunction(data, index: any = null) {
    this.jobExpenseLabel = data.extras.find(item => item.id == 'bill_no')?.value;    
    this.listIndexData = { 'id': data.id, 'index': index };
    this.popupInputData['show'] = true;
    this._popupBodyScrollService.popupActive()
  }

  confirmButton(event) {
    if (event) {
      let id = this.listIndexData['id'];
      this.deleteMechanic(id);
      this.listIndexData = {};
    }
  }

  onClickCancel() {
    this.routeToDetail = false;
  }
  openListDetailsData(e) {
    this.routeToDetail = !this.routeToDetail;
    let queryParams = new Object({
      selectedTab: this.listQueryParams.status,
      start_date: this.listQueryParams.start_date,
      end_date: this.listQueryParams.end_date,
      search: this.listQueryParams.search,
      filter: this.listQueryParams.filters,
      label : this.listQueryParams.label
    });
    this._router.navigate([getPrefix() + this.listUrl], { queryParams });
  }

  settingsApplied(event: boolean) {
    if (event) {
      this.listQueryParams.next_cursor = '';
      this.getTripExpList(this.listQueryParams);
    }
  }
  
  exportList(e) {
		let companyName = localStorage.getItem('companyName');
		this._commonloaderservice.getShow();
		let queryParams = cloneDeep(this.listQueryParams)
		queryParams['export']=true
		delete queryParams['next_cursor']
		this._operationService.getAllTripExpenseExportExcel(queryParams).subscribe((resp:any) => {
			let fileName;
			let type = 'xlsx'
			fileName = companyName + "_" + "Trip_Expense"   + '.' + type;
			this._fileDownload.writeAndOpenFile(resp, fileName).then(data => {
				this._commonloaderservice.getHide();
			});
		},(err)=>{
      console.log(err);
      
    })
	}

}
