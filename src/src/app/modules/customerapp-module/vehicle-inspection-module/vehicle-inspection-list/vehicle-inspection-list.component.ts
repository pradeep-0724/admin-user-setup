import { Component, OnInit } from '@angular/core';
import { cloneDeep } from 'lodash';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { ButtonData, ListWidgetData } from '../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2-interface';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { VehicleInspectionServiceService } from '../../api-services/vehicle-inspection/vehicle-inspection-service.service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { CommonService } from 'src/app/core/services/common.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-vehicle-inspection-list',
  templateUrl: './vehicle-inspection-list.component.html',
  styleUrls: ['./vehicle-inspection-list.component.scss'],
  host: {
    '(document:click)': 'outSideClick($event)'
  } 
})
export class VehicleInspectionListComponent implements OnInit {

  filterUrl = 'revenue/vehicle_inspection/filter/'
  listUrl = '/vehicle-inspection/list'
  settingsUrl='revenue/vehicle_inspection/setting/'
  defaultParams = {
    next_cursor: '',
    search: '',
    filters: [],
    label :''
  };
  listQueryParams = {
    next_cursor: '',
    search: '',
    filters: [],
    label :''
  }
  vehicleInspectionList = [];
  vehicleInspectionHeader=[];
  isLoading = false;
  deleteVehiclenspection;
  popupInputData = {
    'msg': 'Are you sure, you want to delete?',
    'type': 'warning',
    'show': false
  }
  siteInspection='super_user';
  prefixUrl = getPrefix();
  buttonData: ButtonData = {
    name: 'Add Vehicle Inspection',
    permission:'super_user',
    url: this.prefixUrl + '/vehicle-inspection/add'
  }
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  analyticsType = OperationConstants;
  showOptions: string = '';
  vehicleInspection=Permission.vehicleInspection.toString().split(',')
  vehicleCategiriesObj={
    hasMultipleCategories:false,
    categories:[]
  };
  vehicleInspectionNumber = '';

  constructor(private _analytics: AnalyticsService,
     private commonloaderservice: CommonLoaderService, 
     private router: Router,
     private _commonService:CommonService,
     private route: ActivatedRoute,private _setHeight:SetHeightService,
     private _fileDownload:FileDownLoadAandOpen,private apiHandler: ApiHandlerService,
     private _vehicleInspectionService : VehicleInspectionServiceService) { }

  ngOnInit(): void {
    setTimeout(() => {
    this.commonloaderservice.getHide();
    }, 400);
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.SITEINSPECTION,this.screenType.LIST,"Navigated");
    this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('search')) {
        this.selectedParamsInspectionList()
      } else {
        this.listQueryParams = cloneDeep(this.defaultParams)
        this.getVehicleInspectionListDetails(this.listQueryParams);
      }
    });
    this._commonService.getVehicleCatagoryType().subscribe(resp => {
      this.vehicleCategiriesObj.categories = resp['result']['categories']
    })
  }
  ngAfterViewChecked(): void {
    this._setHeight.setTableHeight2(['.calc-height'],"quotation-list",0)
  }

  listWidgetData(widgetData: ListWidgetData) {    
    let queryParams = new Object(
      {
        search: widgetData.searchValue,
        filter: JSON.stringify(widgetData.filterKeyData),
        label : widgetData.dateRange.selectedOpt
      }
    );
    this.router.navigate([getPrefix() + this.listUrl], { queryParams });
  }


  ngOnDestroy(): void {
    this.commonloaderservice.getShow();
  }
  selectedParamsInspectionList() {
    const queryParams = this.route.snapshot.queryParams;
    this.listQueryParams = {
      search: queryParams['search'],
      next_cursor: '',
      filters: queryParams['filter'],
      label : queryParams['label'],

    }
    this.getVehicleInspectionListDetails(this.listQueryParams);
  }

  getVehicleInspectionListDetails(params) {
    this.vehicleInspectionList=[];
    this.listQueryParams.next_cursor=''
    this._vehicleInspectionService.getVehicleInspectionList(params).subscribe((data) => {      
      this.vehicleInspectionList = data['result'].vi;
      this.vehicleInspectionHeader=data['result'].column
      params.next_cursor = data['result'].next_cursor;
    });
  }
  settingsApplied(event: boolean) {
		if (event) {
			this.listQueryParams.next_cursor = '';
			this.getVehicleInspectionListDetails(this.listQueryParams);
		}
	}

  onScroll(event) {
    const container = document.querySelector('.quotation-list');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoading && this.listQueryParams.next_cursor?.length > 0) {
      this.onScrollGetVehicleInspectionList(this.listQueryParams);
    }
  }

  onScrollGetVehicleInspectionList(params) {
    this.isLoading = true;
    this._vehicleInspectionService.getVehicleInspectionList(params).subscribe(data => {
      this.vehicleInspectionList.push(...data['result'].vi);
      params.next_cursor = data['result'].next_cursor;
      this.isLoading = false;
    })
  }
  exportList(e) {
		let companyName = localStorage.getItem('companyName');
		this.commonloaderservice.getShow();
		let queryParams = cloneDeep(this.listQueryParams)
		queryParams['export']=true
		delete queryParams['next_cursor']
		this._vehicleInspectionService.getVehicleInspectionListExcel(queryParams).subscribe(resp => {
			let fileName;
			let type = 'xlsx'
			fileName = companyName + "_" +'Vehicle_Inspection_List' + '.' + type;
			this._fileDownload.writeAndOpenFile(resp, fileName).then(data => {
				this.commonloaderservice.getHide();
			});
		})
	}

  trackById(item: any): string {
    return item.id;
  }

  popupFunction(data) {
    this.vehicleInspectionNumber = data.extras.find(item => item.id == 'inspection_no')?.value;    
    this.deleteVehiclenspection = data.id;
    this.popupInputData['show'] = true;
  }

  confirmButton(event) {
    if (event) {
      this.commonloaderservice.getShow();
      this.apiHandler.handleRequest(this._vehicleInspectionService.deleteVehicleInspection(this.deleteVehiclenspection), `${this.vehicleInspectionNumber} deleted successfully!`).subscribe(
        {
          next: () => {
            this.commonloaderservice.getHide();
            this.getVehicleInspectionListDetails(this.listQueryParams);
            this._analytics.addEvent(this.analyticsType.DELETED, this.analyticsScreen.VEHICLEINSPECTION, this.screenType.LIST, "Vehicle Inspection Deleted");
          }
        }
      )
    }
    this.popupInputData['show'] = false;
  }

  optionsList(event, list_index) {
    return (this.showOptions = list_index);
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

}