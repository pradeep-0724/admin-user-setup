import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { normalDate } from 'src/app/shared-module/utilities/date-utilis';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { ButtonData, DropDownType, ListWidgetData } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2-interface';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { OperationConstants, ScreenConstants } from 'src/app/core/constants/data-analytics.constants';
import moment from 'moment';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { NewMarketVehicleService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/new-market-vehicle-service/new-market-vehicle.service';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-new-market-vehicle-list',
  templateUrl: './new-market-vehicle-list.component.html',
  styleUrls: ['./new-market-vehicle-list.component.scss'],
  host: {
    '(document:click)': 'outSideClick($event)',
  }
})
export class NewMarketVehicleListComponent implements OnInit,AfterViewChecked {

  vehicleList: any[] = [];
  showOptions = '';
  prefixUrl = getPrefix();
  popupOutputData: any;
  listIndexData = {};
  popupInputData = {
    'msg': 'Are you sure, you want to delete?',
    'type': 'warning',
    'show': false
  };
  filterUrl = 'vehicle/market/filters/';
  listUrl = '/onboarding/vehicle/market/list';
  defaultParams = {
    next_cursor: '',
    search: '',
    status: 1,
    filters: '[]',
  };

  listQueryParams = {
    next_cursor: '',
    search: '',
    status: 1,
    filters: '[]',
  }
  isLoading = false;
  buttonData: ButtonData = {
    name: 'Add Market Vehicle',
    permission: Permission.market_vehicle.toString().split(',')[0],
    url: this.prefixUrl + '/onboarding/vehicle/market/add'
  };
  apiError ='';
  analyticsType = OperationConstants;
	analyticsScreen = ScreenConstants;
  goThroughDetais = {
		show: false,
		url: "https://demo.arcade.software/Ffvs4vSl5Aq2EoSYPw2m?embed%22"
	  };
    tabSelectionList: Array<DropDownType> = [
      {
        label: "Active Market Vehicles",
        value: "1",
      },
      {
        label: "All Market Vehicles",
        value: "0",
      },
      {
        label: "Inactive Market Vehicles",
        value: "2",
      },
      
    ];
	vehiclePer = Permission.market_vehicle.toString().split(',');
  settingsUrl = 'vehicle/setting/';
  vehicleHeader=[];
  marketVehicleList=[];
  vehicleNumber = '';
  
  constructor(private newMarketVehicleService: NewMarketVehicleService, private _router: Router, private route: ActivatedRoute,
   private _setHeight:SetHeightService, private _analytics: AnalyticsService,private _fileDownload: FileDownLoadAandOpen, private _commonloaderservice : CommonLoaderService,
   private apiHandler: ApiHandlerService,) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('selectedTab')) {
        this.selectedParamsVehicleList();
      } else {
        this.listQueryParams = cloneDeep(this.defaultParams)
        this.getVehicleList(this.listQueryParams);

      }
    });
    this._commonloaderservice.getHide()
  }
  ngAfterViewChecked(): void {
    this._setHeight.setTableHeight2(['.calc-height'],'market-vehicle-list',0)
  }

  selectedParamsVehicleList() {
    const queryParams = this.route.snapshot.queryParams;
    this.listQueryParams = {
      search: queryParams['search'],
      status: queryParams['selectedTab'],
      next_cursor: '',
      filters: queryParams['filter']

    }
    this.getVehicleList(this.listQueryParams);
  }

  getVehicleList(params) {
    this.vehicleHeader=[];
    this.marketVehicleList=[];
    this.newMarketVehicleService.getNewMarketVehicleList(params).subscribe((data:any) => {
      this.vehicleHeader =data['result']['column'];      
      if(data['result'].vehicle_list.length>0){
        this.marketVehicleList =data['result'].vehicle_list
        params.next_cursor = data['result'].next_cursor;
      }      
      
    });
  }

  listWidgetData(widgetData: ListWidgetData) {
    let queryParams = new Object(
      {
        search: widgetData.searchValue,
        selectedTab: widgetData.tabSelection,
        filter: JSON.stringify(widgetData.filterKeyData)
      }
    );
    this._router.navigate([getPrefix() + this.listUrl], { queryParams });
  }

  onScroll(event) {
    const container = document.querySelector('.custom-table-container');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoading && this.listQueryParams.next_cursor.length > 0) {      
      this.onScrollGetVehicleList(this.listQueryParams);
    }
  }
  settingsApplied(event: boolean) {
    if (event) {
      this.listQueryParams.next_cursor = '';
      this.getVehicleList(this.listQueryParams);
    }
  }

  onScrollGetVehicleList(params) {
    this.isLoading = true;
    this.newMarketVehicleService.getNewMarketVehicleList(params).subscribe(data => {
      this.marketVehicleList.push(...data['result'].vehicle_list)
      params.next_cursor = data['result'].next_cursor;
      this.isLoading = false;
    })
  }
  
  trackById(item: any): string {
    return item.id;
  }

  outSideClick(env) {
    if ((env.target.className).indexOf('more-icon') == -1)
      this.showOptions = ''
  }
  optionsList(event, list_index) {
    return this.showOptions = list_index;
  }

  dateChange(date) {
    return normalDate(date);
  }

  popupFunction(data, index: any = null) {    
    this.vehicleNumber =  data.extras.find((item) => item.id == 'vehicle_no')?.value;	
    this.listIndexData = { 'id': data.id, 'index': index };
    this.popupInputData['show'] = true;
    this.popupInputData['is_market_vehicle'] = data.is_market_vehicle
  }

  confirmButton(event) {
    if (event) {
      let id = this.listIndexData['id'];
      this.deleteVehicle(id);
      this.listIndexData = {};
    }
  }

  deleteVehicle(id){
    this.apiHandler.handleRequest(this.newMarketVehicleService.deleteMarketVehicel(id),` ${this.vehicleNumber} marked inactive successfully!`).subscribe(
      {
				next: () => {
					this._analytics.addEvent(this.analyticsType.DELETED, this.analyticsScreen.MARKETVEHICLES)
				  this.listQueryParams.next_cursor='';
				  this.getVehicleList(this.listQueryParams);
			  },
        error: (error) => {
          this.apiError = error['error']['message'];
          this.popupInputData['show'] = false;
          setTimeout(() => {
            this.apiError = '';
          }, 3000);
        }
      }
		);
  }

  exportList(e) {    
		let companyName = localStorage.getItem('companyName');
		let selectionType=this.tabSelectionList[this.listQueryParams.status].label
		let todaysDate = moment().format('DD-MM-YYYY')
		this._commonloaderservice.getShow();
		let queryParams = cloneDeep(this.listQueryParams)
		queryParams['export']=true
		delete queryParams['next_cursor']
		this.newMarketVehicleService.exportMarketVehicelList(queryParams).subscribe(resp => {      
			let fileName;
			let type = 'xlsx'
			fileName = companyName + "_" + selectionType + "_" + todaysDate + '.' + type;
			this._fileDownload.writeAndOpenFile(resp, fileName).then(data => {
				this._commonloaderservice.getHide();
			});
		},(err)=>{
      console.log(err);
      
    })
	}

  openGothrough(){
		this.goThroughDetais.show=true;
	}

  activateVehicle(data) {    
    this.vehicleNumber =  data.extras.find((item) => item.id == 'vehicle_no')?.value;
    this.apiHandler.handleRequest(this.newMarketVehicleService.activateMarketVehicel(data.id), ` ${ this.vehicleNumber} activated successfully!`).subscribe(
      {
        next: () => {
					this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.MARKETVEHICLES)
          this.listQueryParams.next_cursor = '';
          this.getVehicleList(this.listQueryParams)
        },
        error: (err) => {
          this.apiError = err['error'].message;
          setTimeout(() => {
            this.apiError = ''
          }, 3000);
        }
      }
    )
  
	}

}
