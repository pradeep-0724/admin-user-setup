import { Permission } from "../../../../../core/constants/permissionConstants";
import { AfterViewChecked, Component, OnDestroy, OnInit } from "@angular/core";
import { OperationsActivityService } from "../../../api-services/operation-module-service/operations-activity.service";
import { changeDateToServerFormat } from "src/app/shared-module/utilities/date-utilis";
import { BehaviorSubject } from "rxjs";
import { CurrencyService } from "src/app/core/services/currency.service";
import {
  getPrefix,
  PrefixUrlService,
} from "src/app/core/services/prefixurl.service";
import { popupOverflowService } from "src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service";
import {
  OperationConstants,
  ScreenConstants,
  ScreenType,
} from "src/app/core/constants/data-analytics.constants";
import { AnalyticsService } from "src/app/core/services/analytics.service";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { cloneDeep } from "lodash";
import moment from "moment";
import { ListWidgetData } from "../../new-trip-v2/list-module-v2/list-module-v2-interface";
import { CommonLoaderService } from "src/app/core/services/common_loader_service.service";
import { FileDownLoadAandOpen } from "src/app/core/services/file-download-service";
import { SetHeightService } from "src/app/core/services/set-height.service";
import { ApiHandlerService } from "src/app/core/services/api-handler.service";

@Component({
  selector: "app-list-fleet-owner-expenses",
  templateUrl: "./list-fleet-owner-expenses.component.html",
  styleUrls: ["./list-fleet-owner-expenses.component.scss"],
  host: {
    "(document:click)": "outSideClick($event)",
  },
})
export class ListFleetOwnerExpensesComponent implements OnInit, OnDestroy, AfterViewChecked {
  showOptions: string = "";
  currency_type;
  fleetOwnerDetailId = new BehaviorSubject("");
  openListDetails = new BehaviorSubject(false);
  popupInputData = {
    msg: "Are you sure, you want to delete?",
    type: "warning",
    show: false,
  };
  goThroughDetais = {
    show: false,
    url: "https://demo.arcade.software/hjCYjPtLfY7LntvUna3s?embed%22",
  };
  popupOutputData: any;
  listIndexData = {};
  selectedId = "";
  vehicleProviderPermission = Permission.vehicle_provider.toString().split(",");
  prefixUrl: string;
  analyticsType = OperationConstants;
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  start_date = moment().subtract(30, "days").format("YYYY-MM-DD");
  end_date = moment().format("YYYY-MM-DD");
  defaultParams = {
    start_date: null,
    end_date: null,
    next_cursor: "",
    search: "",
    status: "0",
    filters: '[]',
    label: ''
  };
  listQueryParams = {
    start_date: this.start_date,
    end_date: this.end_date,
    next_cursor: "",
    search: "",
    status: "",
    filters: '[]',
    label: ''
  };
  tabSelectionList: Array<any> = [
    {
      label: "All Vehicle Payment Bills",
      value: "0",
    },
    {
      label: "Paid  Vehicle Payment Bills",
      value: "1",
    },
    {
      label: "Unpaid  Vehicle Payment Bills",
      value: "2",
    },
    {
      label: "Partially Paid  Vehicle Payment Bills",
      value: "3",
    },
  ];
  buttonData: any = {
    name: "Add Vehicle Payment ",
    permission: Permission.vehicle_provider.toString().split(",")[0],
    url: getPrefix() + "/trip/vehicle-payment/add",
  };
  vehiclePaymentList = [];
  vehiclePaymentListHeader: any[] = [];
  isLoading = false;
  listUrl = "/trip/vehicle-payment/list";
  settingsUrl = 'operation/fleetowner/setting/';
  filterUrl = "operation/fleetowner/filters/";
  vehiclePaymentLabel = '';

  constructor(
    private _operationService: OperationsActivityService,
    private _analytics: AnalyticsService,
    private currency: CurrencyService,
    private _prefixUrl: PrefixUrlService,
    private _popupBodyScrollService: popupOverflowService,
    private _activateRoute: ActivatedRoute,
    private _router: Router,
    private commonloaderservice: CommonLoaderService,
    private _fileDownload: FileDownLoadAandOpen,
    private _commonloaderservice: CommonLoaderService,
    private _setHeight: SetHeightService,
    private apiHandler: ApiHandlerService,
  ) { }

  ngOnDestroy(): void {
    this.commonloaderservice.getShow()
  }
  ngAfterViewChecked(): void {

    this._setHeight.setTableHeight2(['.calc-height'], 'vehicle-payment-list', 0)

  }

  ngOnInit() {
    this.commonloaderservice.getHide();
    this._analytics.addEvent(
      this.analyticsType.IN,
      this.analyticsScreen.VENHICLEPROVIDER,
      this.screenType.LIST,
      "Navigated"
    );
    this.prefixUrl = this._prefixUrl.getprefixUrl();
    this.currency_type = this.currency.getCurrency();

    this._activateRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("selectedTab") && !paramMap.has("pdfViewId")) {
        this.selectedParamsVehPaymentList();
      } else if (paramMap.has("pdfViewId") && paramMap.has("selectedTab")) {
        this.selectedParamsVehPaymentList();
        this.routeToDetailById(paramMap["params"]["pdfViewId"]);
      } else if (paramMap.has("pdfViewId") && !paramMap.has("selectedTab")) {
        this.routeToDetailById(paramMap["params"]["pdfViewId"]);
      } else {
        this.listQueryParams = cloneDeep(this.defaultParams);
        this.getVehiclePaymentList(this.listQueryParams);
      }
    });
  }

  getVehiclePaymentList(params) {
    this.listQueryParams.next_cursor = "";
    this._operationService.getAllFleetExpense(params).subscribe((data) => {
      this.vehiclePaymentList = data["result"].fo;
      this.vehiclePaymentListHeader = data['result'].column;
      params.next_cursor = data["result"].next_cursor;
    });
  }

  selectedParamsVehPaymentList() {
    const queryParams = this._activateRoute.snapshot.queryParams;
    this.listQueryParams = {
      start_date: changeDateToServerFormat(queryParams["start_date"]),
      end_date: changeDateToServerFormat(queryParams["end_date"]),
      search: queryParams["search"],
      status: queryParams["selectedTab"],
      next_cursor: "",
      filters: queryParams["filter"],
      label: queryParams['label'],
    };
    this.getVehiclePaymentList(this.listQueryParams);
  }

  listWidgetData(widgetData: ListWidgetData) {
    let queryParams = new Object({
      selectedTab: widgetData.tabSelection,
      start_date: widgetData.dateRange.startDate,
      end_date: widgetData.dateRange.endDate,
      search: widgetData.searchValue,
      filter: JSON.stringify(widgetData.filterKeyData),
      label: widgetData.dateRange.selectedOpt,
    });
    this._router.navigate([getPrefix() + this.listUrl], { queryParams });
  }

  onScroll(event) {
    const container = document.querySelector(".vehicle-payment-list-wrap");
    if (
      container.scrollTop + container.clientHeight >=
      container.scrollHeight - 10 &&
      !this.isLoading &&
      this.listQueryParams.next_cursor?.length > 0
    ) {
      this.onScrollGetVehPaymentList(this.listQueryParams);
    }
  }

  onScrollGetVehPaymentList(params) {
    this.isLoading = true;
    this._operationService.getAllFleetExpense(params).subscribe((data) => {
      this.vehiclePaymentList.push(...data["result"].fo);
      params.next_cursor = data["result"].next_cursor;
      this.isLoading = false;
    });
  }

  routeToDetailById(id) {
    this._router.navigate([getPrefix() + '/trip/vehicle-payment/view/', id]);
  }
  createQueryParems(id) {
    let queryParams = new Object({
      selectedTab: this.listQueryParams.status,
      start_date: this.listQueryParams.start_date,
      end_date: this.listQueryParams.end_date,
      search: this.listQueryParams.search,
      filter: this.listQueryParams.filters,
      pdfViewId: id,
      label: this.listQueryParams.label
    });
    this._router.navigate([getPrefix() + this.listUrl], { queryParams });
  }

  openGothrough() {
    this.goThroughDetais.show = true;
  }

  deleteMechanic(mechanic_id) {
    this.apiHandler.handleRequest(this._operationService.deleteFleetExpense(mechanic_id),`${this.vehiclePaymentLabel} deleted successfully!` ).subscribe(
      {
				next: () => {
				  this._analytics.addEvent(this.analyticsType.DELETED,this.analyticsScreen.VENHICLEPROVIDER);
					this.listQueryParams.next_cursor = '';
					this.getVehiclePaymentList(this.listQueryParams);
				  },
				  error: () => {
					
				  },
			}
    );
  }


  outSideClick(env) {
    try {
      if (env.target.className.indexOf("more-icon") == -1) {
        this.showOptions = "";
      }
    } catch (error) {
      console.log(error);
    }
  }

  optionsList(event, list_index) {
    return (this.showOptions = list_index);
  }

  popupFunction(data, index: any = null) {
    this.vehiclePaymentLabel = data.extras.find(item => item.id == 'bill_no')?.value;    
    this.listIndexData = { id: data.id, index: index };
    this.popupInputData["show"] = true;
    this._popupBodyScrollService.popupActive();
  }

  confirmButton(event) {
    if (event) {
      let id = this.listIndexData["id"];
      this.deleteMechanic(id);
      this.listIndexData = {};
    }
  }
  openListDetailsData(e) {
    let queryParams = new Object({
      selectedTab: this.listQueryParams.status,
      start_date: this.listQueryParams.start_date,
      end_date: this.listQueryParams.end_date,
      search: this.listQueryParams.search,
      filter: this.listQueryParams.filters,
      label: this.listQueryParams.label
    });
    this._router.navigate([getPrefix() + this.listUrl], { queryParams });
  }

  settingsApplied(event: boolean) {
    if (event) {
      this.listQueryParams.next_cursor = '';
      this.getVehiclePaymentList(this.listQueryParams);
    }
  }

  exportList(e) {
    let companyName = localStorage.getItem('companyName');
    this._commonloaderservice.getShow();
    let queryParams = cloneDeep(this.listQueryParams)
    queryParams['export'] = true
    delete queryParams['next_cursor']
    this._operationService.getAllFleetExpenseExportExcel(queryParams).subscribe((resp: any) => {
      let fileName;
      let type = 'xlsx'
      fileName = companyName + "_" + "Vehicle_Payment" + '.' + type;
      this._fileDownload.writeAndOpenFile(resp, fileName).then(data => {
        this._commonloaderservice.getHide();
      });
    }, (err) => {
      console.log(err);

    })
  }
}
