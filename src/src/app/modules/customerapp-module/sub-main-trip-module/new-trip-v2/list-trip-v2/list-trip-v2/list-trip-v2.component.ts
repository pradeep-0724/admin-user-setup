import { AfterViewChecked, Component, OnDestroy, OnInit } from "@angular/core";
import { getPrefix } from "src/app/core/services/prefixurl.service";
import { ButtonData, DropDownType, ListWidgetData } from "../../list-module-v2/list-module-v2-interface";
import { NewTripV2Service } from "../../../../api-services/trip-module-services/trip-service/new-trip-v2.service";
import { CommonLoaderService } from "src/app/core/services/common_loader_service.service";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { changeDateToServerFormat } from "src/app/shared-module/utilities/date-utilis";
import { cloneDeep } from "lodash";
import { Permission } from "src/app/core/constants/permissionConstants";
import { NewTripService } from "../../../../api-services/trip-module-services/trip-service/new-trip-service";
import { LiveTrackingComponent } from "../../new-trip-details-v2/live-tracking/live-tracking.component";
import { Dialog } from "@angular/cdk/dialog";
import { FileDownLoadAandOpen } from "src/app/core/services/file-download-service";
import { AnalyticsService } from "src/app/core/services/analytics.service";
import { ScreenConstants, ScreenType, OperationConstants } from "src/app/core/constants/data-analytics.constants";
import { ToolTipInfo } from "../../new-trip-v2-utils/new-trip-v2-utils";
import { NewTripV2Constants } from "../../new-trip-v2-constants/new-trip-v2-constants";
import { SetHeightService } from "src/app/core/services/set-height.service";
import { ApiHandlerService } from "src/app/core/services/api-handler.service";
import { dateWithTimeZone } from "src/app/core/services/time-zone.service";
@Component({
  selector: "app-list-trip-v2",
  templateUrl: "./list-trip-v2.component.html",
  styleUrls: ["./list-trip-v2.component.scss"],
  host: {
    '(document:click)': 'outSideClick($event)'
  }
})

export class ListTripV2Component implements OnInit, OnDestroy, AfterViewChecked {
  unassigned_veh_sidebar = false;
  constantsTripV2 = new NewTripV2Constants();
  prefixUrl = getPrefix();
  googleMaps = `../../../../../../../assets/img/google-maps.png`;
  showOptions: any;
  settingsUrl = 'revenue/trip/vehicle/setting/';
  listUrl = '/trip/new-trip/list';
  isNormalList: boolean = true;
  filterUrl = 'revenue/trip/vehicle/filters/'
  isLiveStatusOpen: boolean = false;
  mapRedIcon = `<img  class="cursor-pointer trip-list-map-icon" src="../../../../../../../assets/img/icons/google-maps-red.png" />`
  mapGrayIcon = `<img  class="cursor-pointer trip-list-map-icon" src="../../../../../../../assets/img/icons/google-maps-gray.png" />`;

  tabSelectionList: Array<DropDownType> = [
    {
      label: "All Job",
      value: "1",
    },
    {
      label: "Scheduled",
      value: "2",
    },
    {
      label: "Ongoing",
      value: "3",
    },
    {
      label: "Completed",
      value: "4",
    },
    {
      label: "Void",
      value: "5",
    },
    {
      label: 'Invoiced',
      value: '6'
    }
  ];
  tripDeleteConfirmationPopup = {
    'msg': 'Are you sure, you want to delete?',
    'type': 'warning',
    'show': false
  }
  defaultParams = {
    start_date: null,
    end_date: null,
    next_cursor: '',
    search: '',
    status: '1',
    filters: [],
    label: 'Today'
  };
  listQueryParams = {
    start_date: '',
    end_date: '',
    next_cursor: '',
    search: '',
    status: '',
    filters: [],
    label: ''

  }
  GrayMapIconTooltip: ToolTipInfo;
  RedMapIconTooltip: ToolTipInfo;
  selectedTripId: string = '';
  isLoading = false;
  buttonData: ButtonData = {
    name: 'Add Job',
    permission: Permission.trip.toString().split(',')[0],
    url: this.prefixUrl + '/trip/new-trip/add'
  };
  trip = Permission.trip__new_trip.toString().split(',');
  goThroughDetais = {
    show: false,
    url: "https://demo.arcade.software/KT9cpxAmrxUoi1Kas5IL?embed%22"
  }
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  analyticsType = OperationConstants;
  newTripStat: any
  tripHeader = [];
  newTripList = [];
  jobLable = '';

  constructor(private newTripV2Service: NewTripV2Service, private commonloaderservice: CommonLoaderService, private router: Router, private route: ActivatedRoute, private apiHandler: ApiHandlerService,
    private _service: NewTripService, public dialog: Dialog, private _fileDownload: FileDownLoadAandOpen, private _analytics: AnalyticsService, private _setHeight: SetHeightService
  ) { }

  ngOnDestroy(): void {
    this.commonloaderservice.getShow();
  }
  ngAfterViewChecked(): void {
    if (this.isNormalList) {
      this._setHeight.setTableHeight2(['.calc-height'], 'normal-list', 0)
    } else {
      this._setHeight.setTableHeight2(['.calc-height'], 'extended-list', 0)

    }
  }

  ngOnInit(): void {
    this.commonloaderservice.getHide();
    this.getTripListStat();
    this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.NEWTRIP, this.screenType.LIST, "Navigated");
    this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('selectedTab')) {
        this.selectedParamsTripList()
      } else {
        this.listQueryParams = cloneDeep(this.defaultParams)
        this.getTripList(this.listQueryParams);
        this.isNormalList = true;
      }
    });
    this.GrayMapIconTooltip = {
      content: this.constantsTripV2.toolTipMessages.APP_NOT_ACTIVE.CONTENT
    }
    this.RedMapIconTooltip = {
      content: this.constantsTripV2.toolTipMessages.RED_MAP_ICON_TEXT.CONTENT
    }
  }

  openGothrough() {
    this.goThroughDetais.show = true;
  }

  onScroll(event) {
    const container = document.querySelector('.trip-normal-list');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoading && this.listQueryParams.next_cursor?.length > 0) {
      this.onScrollGetTripList(this.listQueryParams);
    }
  }

  onScrollExtended(event) {
    const container = document.querySelector('.trip-extended-list');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoading && this.listQueryParams.next_cursor?.length > 0) {
      this.onScrollGetTripList(this.listQueryParams);
    }
  }

  trackById(item: any): string {
    return item.id;
  }

  onScrollGetTripList(params) {
    this.isLoading = true;
    this.newTripV2Service.getNewTripList(params).subscribe(data => {
      this.newTripList.push(...data['result'].trips)
      params.next_cursor = data['result'].next_cursor;
      this.isLoading = false;
    })
  }


  viewChange(event: boolean) {
    this.isNormalList = event
    this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.NEWTRIP, this.screenType.LIST, "Trip List View Change");

  }

  listWidgetData(widgetData: ListWidgetData) {
    let queryParams = new Object(
      {
        selectedTab: widgetData.tabSelection,
        start_date: widgetData.dateRange.startDate,
        end_date: widgetData.dateRange.endDate,
        search: widgetData.searchValue,
        filter: JSON.stringify(widgetData.filterKeyData),
        label: widgetData.dateRange.selectedOpt,
      }
    );
    this.router.navigate([getPrefix() + this.listUrl], { queryParams });
  }

  optionsList(list_index) {
    return this.showOptions = list_index;
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

  deleteTrip(data: any) {
		this.jobLable = data.extras.find(item => item.id == 'trip_id')?.value?.name;		
    this.selectedTripId = data.id;
    this.tripDeleteConfirmationPopup.show = true;
  }

  confirmButton(e) {
    if (e) {
      this.commonloaderservice.getShow();
      this.apiHandler.handleRequest(this._service.deleteTripsDetails(this.selectedTripId), ` ${this.jobLable} Job deleted successfully!`).subscribe(
        {
          next: () => {
            this.listQueryParams.next_cursor = '';
            this.commonloaderservice.getHide();
            this.getTripList(this.listQueryParams);
            this.getTripListStat();
            this._analytics.addEvent(this.analyticsType.DELETED, this.analyticsScreen.NEWTRIP, this.screenType.LIST, "Trip deleted");
          },
          error: () => {
            this.commonloaderservice.getHide();
          },
        }
      )
    }
  }

  settingsApplied(event: boolean) {
    if (event) {
      this.listQueryParams.next_cursor = '';
      this.getTripList(this.listQueryParams);
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
      label: queryParams['label'],

    }
    this.getTripList(this.listQueryParams);
  }


  openUnassignedVehicleList() {
    this.unassigned_veh_sidebar = true;

  }

  scheduledOwnVehicle() {
    let queryParams = new Object(
      {
        selectedTab: "2",
        search: "",
        start_date:dateWithTimeZone(),
        end_date: dateWithTimeZone(),
        filter: "[{\"key\":\"a_vtype\",\"values\":[\"Own\"]}]",
        label: this.listQueryParams.label
      }
    );
    this.router.navigate([getPrefix() + this.listUrl], { queryParams });
  }

  scheduledTrips() {
    let queryParams = new Object(
      {
        selectedTab: "2",
        search: "",
        start_date:dateWithTimeZone(),
        end_date: dateWithTimeZone(),
        filter: "[]",
        label: this.listQueryParams.label
      }
    );
    this.router.navigate([getPrefix() + this.listUrl], { queryParams });
  }

  ongoingTrips() {
    let queryParams = new Object(
      {
        selectedTab: "3",
        search: "",
        start_date:dateWithTimeZone(),
        end_date: dateWithTimeZone(),
        filter: "[]",
        label: this.listQueryParams.label
      }
    );
    this.router.navigate([getPrefix() + this.listUrl], { queryParams });
  }

  ongoingOwnVehicleTrips() {
    let queryParams = new Object(
      {
        selectedTab: "3",
        search: "",
        start_date:dateWithTimeZone(),
        end_date: dateWithTimeZone(),
        filter: "[{\"key\":\"a_vtype\",\"values\":[\"Own\"]}]",
        label: this.listQueryParams.label
      }
    );
    this.router.navigate([getPrefix() + this.listUrl], { queryParams });
  }


  getTripList(params) {
    this.tripHeader = [];
    this.newTripList = [];
    this.newTripV2Service.getNewTripList(params).subscribe((data) => {
      const container = document.querySelector('.trip-normal-list');
      this.tripHeader = data['result']['column']

      if (container) container.scrollTo(0, 0)
      if (data['result'].trips.length) {
        this.newTripList = data['result'].trips
        params.next_cursor = data['result'].next_cursor;
      }
    });
  }

  openLiveTracking(id, openDialog: boolean) {
    if (openDialog) {
      const dialogRef = this.dialog.open(LiveTrackingComponent, {
        minWidth: '50%',
        data: {
          tripId: id,
        },
        closeOnNavigation: true,
        disableClose: true,
        autoFocus: false
      });

      let dialogRefSub = dialogRef.closed.subscribe(result => {
        this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.NEWTRIP, this.screenType.LIST, "Trip Live Tracking Opened");
        dialogRefSub.unsubscribe()
      });
    }

  }

  exportList(e) {
    let params = cloneDeep(this.listQueryParams)
    params['export'] = true
    params['is_expanded'] = !this.isNormalList
    delete params['next_cursor']
    let fileName = "Job List" + '.' + 'xlsx';
    if (e)
      this.newTripV2Service.downloadTripList(params).subscribe((data) => {
        this._fileDownload.writeAndOpenFile(data, fileName).then(resp => {
          this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.NEWTRIP, this.screenType.LIST, "Job List File Downloaded");
        });
      });
  }
  getTripListStat() {
    this.newTripV2Service.getTripListStat().subscribe(resp => {
      this.newTripStat = resp['result']
    });
  }

  isString(value: any): boolean {
    return typeof value === 'string';
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }


}
