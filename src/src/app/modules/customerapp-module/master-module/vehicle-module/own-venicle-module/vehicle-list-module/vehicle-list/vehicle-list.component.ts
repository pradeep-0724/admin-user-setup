import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { normalDate } from '../../../../../../../shared-module/utilities/date-utilis';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { PrefixUrlService, getPrefix } from 'src/app/core/services/prefixurl.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { CreateVehicleService } from 'src/app/core/services/create-vehicle.service';
import { DropDownType, ButtonData, ListWidgetData } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2-interface';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import { OwnVehicleService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/own-vehicle-service';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';


@Component({
	selector: 'app-vehicle-list',
	templateUrl: './vehicle-list.component.html',
	styleUrls: [
		'./vehicle-list.component.scss'
	],
	host: {
		'(document:click)': 'outSideClick($event)',
	}
})
export class VehicleListComponent implements OnInit, OnDestroy,AfterViewChecked{

	prefixUrl = getPrefix();
	showOptions: any;
	listUrl = '/onboarding/vehicle/own/vehicle-list';
	filterUrl = 'vehicle/own/filters/'
	tabSelectionList: Array<DropDownType> = [
		{
			label: "Active Own Vehicles",
			value: "1",
		},
		{
			label: "Inactive Own Vehicles",
			value: "2",
		},
		{
			label: "All Own Vehicles",
			value: "0",
		},

	];
	defaultParams = {
		next_cursor: '',
		search: '',
		status: '1',
		filters: '[]'
	};

	listQueryParams = {
		next_cursor: '',
		search: '',
		status: '',
		filters: '[]'
	}
	isLoading = false;
	buttonData: ButtonData = {
		name: 'Add Own Vehicle',
		permission: Permission.vehicle.toString().split(',')[0],
		url: this.prefixUrl + '/onboarding/vehicle/own/add'
	};
	vehicleList: any = [];
	videoUrl = "https://ts-pub-directory.s3.ap-south-1.amazonaws.com/vehicle.mp4";
	toggle_disabled: boolean = false;
	vehicle = Permission.vehicle.toString().split(',')
	popupInputData = {
		'msg': 'Are you sure, you want to delete?',
		'type': 'warning',
		'show': false
	}
	popupOutputData: any;
	listIndexData = {};
	preFixUrl = ''
	analyticsType = OperationConstants;
	analyticsScreen = ScreenConstants;
	screenType = ScreenType;
	canCreateVehicle: boolean = true;
	registeredVehicles: number;
	vehiclePer = Permission.vehicle.toString().split(',');
	goThroughDetais = {
		show: false,
		url: "https://demo.arcade.software/Ffvs4vSl5Aq2EoSYPw2m?embed%22"
	}
	settingsUrl = 'vehicle/own/setting/';
    vehicleListHeader=[];
	vehicleNumber = '';



	constructor(private _ownVehicleService: OwnVehicleService, private _analytics: AnalyticsService, private route: ActivatedRoute,
		private _router: Router, private _prefixUrl: PrefixUrlService, private _fileDownload: FileDownLoadAandOpen,private apiHandler: ApiHandlerService,

		private _commonloaderservice: CommonLoaderService, private _createVehicle: CreateVehicleService,private _setHeight:SetHeightService
	) { }

	ngOnDestroy(): void {
		this._commonloaderservice.getShow();
	}
	ngAfterViewChecked(): void {
		this._setHeight.setTableHeight2(['.calc-height'],'own-vehicle-list',0)
	}

	ngOnInit() {
		this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.VEHICLE, this.screenType.LIST, "Navigated");
		this.preFixUrl = this._prefixUrl.getprefixUrl();
		this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
			if (paramMap.has('selectedTab')) {
				this.selectedParamsVehicleList();
			} else {
				this.listQueryParams = cloneDeep(this.defaultParams)
				this.getVehicleList(this.listQueryParams);

			}
		});
	}
	
    settingsApplied(event: boolean) {
      if (event) {
        this.listQueryParams.next_cursor = '';
        this.getVehicleList(this.listQueryParams);
      }
    }

	getVehicleList(params) {
		this.vehicleListHeader=[];
		this.vehicleList=[];

		this._ownVehicleService.getVehicleOwnListV2(params).subscribe((data) => {
			this.vehicleListHeader =data['result']['column'] 
			if(data['result'].vehicle_list.length){     
				this.vehicleList = data['result']['vehicle_list'];
				this.listQueryParams.next_cursor = data['result']['next_cursor']
			}
		});

		this._createVehicle.getIsVehicleCreate().subscribe(resp => {
			this.canCreateVehicle = resp.result.can_create_vehicle
			this._createVehicle.createVehicle = this.canCreateVehicle
			this.registeredVehicles = resp.result.max_vehicles;
			this._commonloaderservice.getHide();
		});
	}
	openGothrough(){
		this.goThroughDetais.show=true;
	}

	dateChange(date) {
		return normalDate(date);
	}

	activateVehicle(vehicle) {
		this.vehicleNumber =  vehicle.extras.find((item) => item.id == 'reg_number')?.value;		
		this.apiHandler.handleRequest(this._ownVehicleService.postActivateVehicleDetails(vehicle.id), `${this.vehicleNumber} activated successfully!`).subscribe(
			{
				next: () => {
					this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.OWNVEHICLES)
					this.listQueryParams.next_cursor = '';
					this.getVehicleList(this.listQueryParams);
				  },
				  error: () => {
				  },
			}
		)
	}


	editVehicle(vehicleId) {
		this._router.navigateByUrl(
			this.preFixUrl +
			'/' +
			TSRouterLinks.onboarding +
			'/' +
			TSRouterLinks.master_vehicle +
			'/own/' +
			TSRouterLinks.master_vehicle_edit +
			'/' +
			vehicleId
		);
	}


	deleteVehicle(id: string) {
		this.apiHandler.handleRequest(this._ownVehicleService.deleteVehicleDetails(id),`${this.vehicleNumber} marked inactive successfully!`).subscribe(
			{
				next: () => {
					this._analytics.addEvent(this.analyticsType.DELETED, this.analyticsScreen.OWNVEHICLES)
					this.listQueryParams.next_cursor = '';
					this.getVehicleList(this.listQueryParams);
				  },
				  error: (error) => {
				  },
			}
		)
		this.popupInputData['show'] = false;
	}


	popupFunction(data, index: any = null) {
		this.vehicleNumber =  data.extras.find((item) => item.id == 'reg_number')?.value;		
		this.listIndexData = { 'id': data.id, 'index': index };
		this.popupInputData['show'] = true;
	}

	confirmButton(event) {
		if (event) {
			let id = this.listIndexData['id'];
			this.deleteVehicle(id);
			this.listIndexData = {};
		}
	}

	listWidgetData(widgetData: ListWidgetData) {
		let queryParams = new Object(
			{
				selectedTab: widgetData.tabSelection,
				search: widgetData.searchValue,
				filter: JSON.stringify(widgetData.filterKeyData)
			}
		);
		this._router.navigate([getPrefix() + this.listUrl], { queryParams });
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


	exportList(e) {
		let companyName = localStorage.getItem('companyName');
		let selectionType=this.tabSelectionList[this.listQueryParams.status].label
		let todaysDate = moment().format('DD-MM-YYYY')
		this._commonloaderservice.getShow();
		let queryParams = cloneDeep(this.listQueryParams)
		queryParams['export']=true
		delete queryParams['next_cursor']
		this._ownVehicleService.getOwnVehicleListExcel(queryParams).subscribe(resp => {
			let fileName;
			let type = 'xlsx'
			fileName = companyName + "_" + selectionType + "_" + todaysDate + '.' + type;
			this._fileDownload.writeAndOpenFile(resp, fileName).then(data => {
				this._commonloaderservice.getHide();
			});
		})
	}

	onScroll(event) {
		const container = document.querySelector('.custom-table-container');
		if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10)&& !this.isLoading && this.listQueryParams.next_cursor?.length > 0) {
		   this.onScrollGetVehicleList(this.listQueryParams);
		}
	  }
	
	
	
	  trackById(item: any): string {
		return item.id;
	  }
	
	  onScrollGetVehicleList(params){
		this.isLoading = true;
		this._ownVehicleService.getVehicleOwnListV2(params).subscribe(data=>{
		  this.vehicleList.push(...data['result']['vehicle_list']);
		  params.next_cursor = data['result']['next_cursor'];
		  this.isLoading = false;
		})
	  }


	optionsList(event, list_index) {

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


}


