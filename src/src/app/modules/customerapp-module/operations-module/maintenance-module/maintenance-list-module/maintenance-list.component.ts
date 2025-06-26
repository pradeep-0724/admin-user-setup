import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { MaintenanceService } from '../operations-maintenance.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { ListWidgetData } from '../../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2-interface';
import { cloneDeep } from 'lodash';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { ToolTipInfo } from '../../../sub-main-trip-module/new-trip-v2/new-trip-v2-utils/new-trip-v2-utils';
import { NewTripV2Constants } from '../../../sub-main-trip-module/new-trip-v2/new-trip-v2-constants/new-trip-v2-constants';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-maintenance-list',
  templateUrl: './maintenance-list.component.html',
  styleUrls: ['./maintenance-list.component.scss'],
  host: {
    '(document:click)': 'outSideClick($event)'
  }
})
export class MaintenanceListComponent implements OnInit ,OnDestroy,AfterViewChecked {
  isLiveStatusOpen=false;
  apiError='';
  maintenanceInputData = {
    'msg': 'Are you sure, you want to delete?',
    'type': 'warning',
    'show': false
  }
  goThroughDetais = {
    show: false,
    url: "https://demo.arcade.software/0GqDWfSAmqvkuk7H92Bs?embed%22"
  }
  delIcon=`<i class="material-icons fake-del-btn" >delete</i>`
  jobCardDeleteId=''
  openListDetails=new BehaviorSubject(false);
  maintenancePermission= Permission.maintenance.toString().split(',')
  showOptions: any;
  screenType=ScreenType;
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;
  prefixUrl = getPrefix();
  tabSelectionList: Array<any> = [
      {
        label: "All Job Cards List",
        value: "0",
      },
      {
        label: "Scheduled Job Cards ",
        value: "1",
      },
      {
        label: "In Progress Job Cards",
        value: "2",
      },
      {
        label: "Completed Job Cards",
        value: "3",
      }
    ];
    date = new Date(dateWithTimeZone());
   start_date = moment(this.date).subtract(30, 'days').format('YYYY-MM-DD');
    end_date = moment(this.date).format('YYYY-MM-DD')
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
    listUrl = '/expense/maintenance/list';
    filterUrl = 'operation/jobcard/flters/';
    isLoading = false;
    maintenanceList=[];
    liveStatus:any;
    currency_type;
    delete_Tooltip: ToolTipInfo;
    constantsTripV2 = new NewTripV2Constants();
    jobCardNumber = '';

  constructor(private apiHandler:ApiHandlerService,private _setHeight:SetHeightService,private _maintenanceService:MaintenanceService,private _route:Router,private _analytics:AnalyticsService,
    private _activatedRoute: ActivatedRoute, private commonloaderservice :CommonLoaderService, private currency: CurrencyService,) { }

  ngOnDestroy(): void {
    this.commonloaderservice.getShow();
  }
  ngAfterViewChecked(): void {
    this._setHeight.setTableHeight2(['.calc-height'],'maintenance-list',0)
  }


  ngOnInit(): void {
    this.currency_type = this.currency.getCurrency();
    setTimeout(() => {
      this.commonloaderservice.getHide()
    }, 400);
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.JOBCARD,this.screenType.LIST,"Entered");
    this._activatedRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('selectedTab')) {
        this.selectedParamsTripList()
      } 
      else {
        this.listQueryParams = cloneDeep(this.defaultParams)
        this.getTripList(this.listQueryParams);

      }
    });

    this.getJobCardLiveStatus();
    this.delete_Tooltip = {
      content: this.constantsTripV2.toolTipMessages.MAINTENANCE_DELETE.CONTENT
    }

  }
  getTripList(params) {
    this.listQueryParams.next_cursor = '';
    this._maintenanceService.getJobCard(params).subscribe((data) => {
      const container = document.querySelector('.fuel-list-wrap');
      container.scrollTo(0,0)      
      this.maintenanceList = data['result'].jc;
      params.next_cursor = data['result'].next_cursor;
    });
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
    this._route.navigate([getPrefix() + this.listUrl], { queryParams });
  }

  selectedParamsTripList() {
    const queryParams = this._activatedRoute.snapshot.queryParams;
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

  onScroll(event) {
    const container = document.querySelector('.fuel-list-wrap');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoading && this.listQueryParams.next_cursor?.length > 0) {
      this.onScrollGetTripList(this.listQueryParams);
    }
  }

  onScrollGetTripList(params) {
    this.isLoading = true;
    this._maintenanceService.getJobCard(params).subscribe(data => {
      this.maintenanceList.push(...data['result'].jc);
      params.next_cursor = data['result'].next_cursor;
      this.isLoading = false;
    })
  }


  openAddMaintenance(){
    this._route.navigateByUrl(getPrefix()+'/expense/maintenance/add/')
  }

  navigateToJobCardDetails(id){
   this._route.navigateByUrl(getPrefix()+'/expense/maintenance/view/'+id)
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
     this.showOptions = list_index;
  }

  confirmButton(e){
   if(e){
    this.deleteJobCard();
   }
  }
  deleteJobCard(){
    this.apiHandler.handleRequest(this._maintenanceService.deleteJobCard(this.jobCardDeleteId),` ${this.jobCardNumber} deleted successfully!`).subscribe(
			{
				next: () => {
          this._analytics.addEvent(this.analyticsType.DELETED,this.analyticsScreen.JOBCARD);
          this.listQueryParams.next_cursor='';
          this.getTripList(this.listQueryParams)
          this.getJobCardLiveStatus();
				  },
				  error: (error) => {
				    this.maintenanceInputData['show'] = false;
					this.apiError = error['error']['message'];
					setTimeout(() => (this.apiError = ''), 3000);
				  },
			}
		)
  }
  openGothrough(){
    this.goThroughDetais.show=true;
  }


  jobCardDeletePopUp(data){
    this.jobCardNumber = data.job_card_no;
    this.jobCardDeleteId=data.id;
    this.maintenanceInputData.show=true;
  }

  getJobCardLiveStatus(){
    this._maintenanceService.getJobCardLiveStatus().subscribe((data) => {
     this.liveStatus=data['result']
    })
  }

  getImageType(value){
    if(value.priority==0) return 'Highest'
    if(value.priority==1) return 'High'
    if(value.priority==2) return 'Medium'
    if(value.priority==3) return 'Low'
    if(value.priority==4) return 'Lowest'
  }

  getJobCardColour(value){
    if(value.status=='Scheduled') return 'rgb(255, 185, 0)';
    if(value.status=='In Progress')return 'rgb(76, 172, 254)';
    if(value.status=='Completed')return 'rgb(43, 183, 65)';
  }
}
