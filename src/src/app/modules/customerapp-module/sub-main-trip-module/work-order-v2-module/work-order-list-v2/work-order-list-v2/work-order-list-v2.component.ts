import { AfterViewChecked, Component, OnDestroy, OnInit } from "@angular/core";
import { getPrefix } from "src/app/core/services/prefixurl.service";
import { CommonLoaderService } from "src/app/core/services/common_loader_service.service";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { changeDateToServerFormat } from "src/app/shared-module/utilities/date-utilis";
import { cloneDeep } from "lodash";
import { Permission } from "src/app/core/constants/permissionConstants";
import { ButtonData, DropDownType, ListWidgetData } from "../../../new-trip-v2/list-module-v2/list-module-v2-interface";
import { WorkOrderV2Service } from "../../../../api-services/trip-module-services/work-order-service/work-order-v2.service";
import { WorkOrderService } from "../../../../api-services/trip-module-services/work-order-service/work-order.service";
import { Dialog } from "@angular/cdk/dialog";
import { CreateMultiTripComponent } from "../../work-order-shared-module/create-multi-trip/create-multi-trip.component";
import { ScreenConstants, ScreenType, OperationConstants } from "src/app/core/constants/data-analytics.constants";
import { AnalyticsService } from "src/app/core/services/analytics.service";
import { FileDownLoadAandOpen } from "src/app/core/services/file-download-service";
import { SetHeightService } from "src/app/core/services/set-height.service";
import { ApiHandlerService } from "src/app/core/services/api-handler.service";
@Component({
  selector: "app-list-work-order-v2",
  templateUrl: "./work-order-list-v2.component.html",
  styleUrls: ["./work-order-list-v2.component.scss"],
  host: {
    '(document:click)': 'outSideClick($event)'
  }
})

export class WorkOrderListV2Component implements OnInit, OnDestroy,AfterViewChecked {
  workOrderList = [];
  workOrderHeaders=[];
  prefixUrl = getPrefix();
  showOptions: any;
  settingsUrl = 'revenue/trip/workorder/setting/';
  listUrl = '/trip/work-order/list';
  isNormalList: boolean = true;
  filterUrl = 'revenue/workorder/filters/';
  workOrderPermission = Permission.workorder.toString().split(',');
  trip = Permission.trip.toString().split(',');
  tabSelectionList: Array<DropDownType> = [
    {
      label: "All Sales Order",
      value: "1",
    },
  ];
  popupInputData = {
    'msg': 'Are you sure, you want to delete?',
    'type': 'warning',
    'show': false
  };
  popupInputDataClose = {
    'msg': 'A closed Sales order cannot be reopened again. Are you sure, you want to close the Sales order?',
    'type': 'warning',
    'show': false
  };
  listIndexData = {};
  defaultParams = {
    start_date: null,
    end_date: null,
    next_cursor: '',
    search: '',
    status: '1',
    filters: [],
    label : ''
  };
  tripUrl = '/trip/new-trip/add'
  listQueryParams = {
    start_date: '',
    end_date: '',
    next_cursor: '',
    search: '',
    status: '',
    filters: [],
    label : ''
  }
  goThroughDetais = {
    show: false,
    url: "https://demo.arcade.software/jtCKag5YglEuHVFcLmd5?embed%22"
  }
  selectedTripId: string = '';
  isLoading = false;
  statusArray = [{
    width: 100,
    isCurrentRouteIdle: false,
  },
  {
    width: 100,
    isCurrentRouteIdle: false,
  },
  {
    width: 100,
    isCurrentRouteIdle: true,
  },
  ]

  buttonData: ButtonData = {
    name: 'Add SO',
    permission: Permission.workorder.toString().split(',')[0],
    url: this.prefixUrl + '/trip/work-order/add'
  }
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  analyticsType = OperationConstants;
  workOrderLabel = '';

  constructor(private _workOrderV2Service: WorkOrderV2Service, private commonloaderservice: CommonLoaderService, private router: Router, private route: ActivatedRoute,
    private _workOrderService: WorkOrderService, public dialog: Dialog, private _analytics: AnalyticsService,private _fileDownload: FileDownLoadAandOpen,
    private _setHeight:SetHeightService,private apiHandler: ApiHandlerService,

  ) { }

  ngOnDestroy(): void {
    this.commonloaderservice.getShow();
  }
  ngAfterViewChecked(): void {
    if(this.isNormalList){
      this._setHeight.setTableHeight2(['.calc-height'],'normal-list',0)

    }
    else{
      this._setHeight.setTableHeight2(['.calc-height'],'extended-list',0);
    }
  }

  ngOnInit(): void {
    this.commonloaderservice.getHide();
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.WORKORDER,this.screenType.LIST,"Navigated");
    this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('selectedTab')) {
        this.selectedParamsTripList()
      } else {
        this.listQueryParams = cloneDeep(this.defaultParams)
        this.getWorkOrderList(this.listQueryParams);
        this.isNormalList = true;
      }
    });
  }

  onScroll(event) {
    const container = document.querySelector('.work-order-normal-list');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoading && this.listQueryParams.next_cursor?.length > 0) {
      this.onScrollGetTripList(this.listQueryParams);
    }
  }
  openGothrough() {
    this.goThroughDetais.show = true;
  }

  onScrollExtended(event) {
    const container = document.querySelector('.work-order-extended-list');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoading && this.listQueryParams.next_cursor?.length > 0) {
      this.onScrollGetTripList(this.listQueryParams);
    }
  }

  trackById(item: any): string {
    return item.id;
  }

  onScrollGetTripList(params) {
    this.isLoading = true;
    this._workOrderV2Service.getWorkOrderList(params).subscribe(data => {
      this.workOrderList.push(...data['result'].wos);
      params.next_cursor = data['result'].next_cursor;
      this.isLoading = false;
    })
  }


  viewChange(event: boolean) {
    this.isNormalList = event
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.WORKORDER,this.screenType.LIST,"WorkOrder View Changed");
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
    this.router.navigate([getPrefix() + this.listUrl], { queryParams });
  }

  optionsList(list_index) {
    return this.showOptions = list_index;
  }

  createNewTrip(data) {
    let queryParams = new Object({
      customerId: data.customer_id,
      workOrderId: data.id
    });
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.WORKORDER,this.screenType.LIST,"Create Trip Button Clicked");
    this.router.navigate([getPrefix() + this.tripUrl], { queryParams });
  }

  closeWorkOrder(data, i) {
    this.workOrderLabel = data.workorder_no;
    this.listIndexData = { 'id': data.id, 'index': i };
    this.popupInputDataClose['show'] = true;

  }
  popupFunction(data, index: any = null) {
    this.workOrderLabel = data.workorder_no;
    this.listIndexData = { 'id': data.id, 'index': index };
    this.popupInputData['show'] = true;
  }

  workorderClose(event) {
    if (event) {
      this.apiHandler.handleRequest(this._workOrderService.closeWorkOrder(this.listIndexData['id']), `${this.workOrderLabel} closed successfully!`).subscribe(
        {
          next: () => {
            this.listQueryParams.next_cursor='';
            this.getWorkOrderList(this.listQueryParams);
            this._analytics.addEvent(this.analyticsType.UPDATED,this.analyticsScreen.WORKORDER,this.screenType.LIST,"Workorder Closed");
            this.listIndexData = {}; 
            },
            error: () => {
            },
        }
      )
    } else {
      this.listIndexData = {};
      this.popupInputDataClose['show'] = false;
    }

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

  deleteTrip(id: any) {
    this.selectedTripId = id;
    this.popupInputData.show = true;
  }

  confirmButton(e) {
    if (e) {
      this.commonloaderservice.getShow();
      this.apiHandler.handleRequest(this._workOrderService.deleteWorkOrder(this.listIndexData['id']),` ${this.workOrderLabel} deleted successfully!`).subscribe(
        {
          next: () => {
            this.commonloaderservice.getHide();
            this.listQueryParams.next_cursor=''
            this.getWorkOrderList(this.listQueryParams);
            this._analytics.addEvent(this.analyticsType.DELETED,this.analyticsScreen.WORKORDER,this.screenType.LIST,"Work order Deleted");
            },
            error: () => {
              this.commonloaderservice.getHide();
            },
        }
      )
    }
    this.popupInputData['show'] = false;
    this.listIndexData = {};
  }

  settingsApplied(event: boolean) {
    if (event) {
      this.listQueryParams.next_cursor = '';
      this.getWorkOrderList(this.listQueryParams);
    }
  }

  selectedParamsTripList() {
    const queryParams = this.route.snapshot.queryParams;
    this.listQueryParams = {
      start_date: changeDateToServerFormat(queryParams['start_date']),
      end_date: changeDateToServerFormat(queryParams['end_date']),
      search: queryParams['search'],
      status: queryParams['selectedTab'],
      next_cursor: '',
      filters: queryParams['filter'],
      label : queryParams['label'],
    }
    this.getWorkOrderList(this.listQueryParams);
  }


  getWorkOrderList(params) {
    this.workOrderList=[];
    this.listQueryParams.next_cursor='';    
    this._workOrderV2Service.getWorkOrderList(params).subscribe((data) => {
      const container = document.querySelector('.work-order-normal-list');
      if(container) container.scrollTo(0,0)
      this.workOrderList = data['result'].wos;
      this.workOrderHeaders=data['result'].column

      params.next_cursor = data['result'].next_cursor;
    });
  }

  createMultipleTrip(data) {
    const dialogRef = this.dialog.open(CreateMultiTripComponent, {
      minWidth: '25%',
      data: data,
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.WORKORDER,this.screenType.LIST,"Create Multiple Trip Button Clicked");
      dialogRefSub.unsubscribe()
    });
  }

  exportList(e) {
    let companyName = localStorage.getItem('companyName');
    let params = cloneDeep(this.listQueryParams)
    params['export'] = true
    params['is_expanded']=!this.isNormalList
    delete params['next_cursor']
    let fileName =companyName+ "_Sales_Order_List" + '.' + 'xlsx';
    if (e)
      this._workOrderV2Service.downloadWOList(params).subscribe((data) => {
        this._fileDownload.writeAndOpenFile(data, fileName).then(resp => {
          this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.NEWTRIP,this.screenType.LIST,"Sales order List File Downloaded");
        });
      });
  }

}
