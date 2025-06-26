import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { PrefixUrlService, getPrefix } from 'src/app/core/services/prefixurl.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { ButtonData, DropDownType, ListWidgetData } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2-interface';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { OwnAssetsService } from 'src/app/modules/customerapp-module/api-services/master-module-services/assets-service/assets-service.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';
import { CreateVehicleService } from 'src/app/core/services/create-vehicle.service';


@Component({
	selector: 'app-list-assets',
	templateUrl: './list-assets.component.html',
	styleUrls: ['./list-assets.component.scss'],
	host: {
		'(document:click)': 'outSideClick($event)',
	}
})
export class ListAssetsComponent implements OnInit, OnDestroy {

	prefixUrl = getPrefix();
	showOptions: any;
	listUrl = '/onboarding/assets/list';
	filterUrl = 'asset/filters/'
	defaultParams = {
		next_cursor: '',
		search: '',
		status: '2',
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
		name: 'Add Own Assets',
		permission: Permission.assets.toString().split(',')[0],
		url: this.prefixUrl + '/onboarding/assets/add'
	};
	assetsList: any = [];
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
	assetsPer = Permission.assets.toString().split(',');
	settingsUrl = 'vehicle/asset/setting/';
	assetsListHeader = [];
	tabSelectionList: Array<DropDownType> = [
		{
			label: "Active Own Assets",
			value: "2",
		},
		{
			label: "Inactive Own Assets",
			value: "1",
		},
		{
			label: "All Own Assets",
			value: "0",
		},

	];
	assetNumber = '';
	registeredAssets = 0;
	canCreateAsset: boolean = true;
  

	constructor(private setHeight: SetHeightService, private _analytics: AnalyticsService, private route: ActivatedRoute,
		private _router: Router, private _prefixUrl: PrefixUrlService, private _fileDownload: FileDownLoadAandOpen,
		private _commonloaderservice: CommonLoaderService, private _ownAssetsService: OwnAssetsService,
		private apiHandler: ApiHandlerService,private _createVehicle: CreateVehicleService
	) { }

	ngOnDestroy(): void {
		this._commonloaderservice.getShow();
	}
	ngAfterViewChecked() {
		this.setHeight.setTableHeight2(['.calc-height'], 'assets-list', 0);
	}

	ngOnInit() {
		this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.OWNASSETS, this.screenType.LIST, "Navigated");
		this.preFixUrl = this._prefixUrl.getprefixUrl();
		this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
			if (paramMap.has('selectedTab')) {
				this.selectedParamsAssetsList();
			} else {
				this.listQueryParams = cloneDeep(this.defaultParams)
				this.getAssetsList(this.listQueryParams);

			}
		});
		this.getCancreateAsset();
	}

	settingsApplied(event: boolean) {
		if (event) {
			this.listQueryParams.next_cursor = '';
			this.getAssetsList(this.listQueryParams);
		}
	}

	getAssetsList(params) {
		this.assetsListHeader = [];
		this.assetsList = [];
		this._ownAssetsService.getAssetsList(params).subscribe((data) => {
			this.assetsListHeader = data['result']['column']

			if (data['result'].assets.length) {
				this.assetsList = data['result']['assets'];
				this.listQueryParams.next_cursor = data['result']['next_cursor']
			}
		});
	}


	editAssets(assetsId) {
		this._router.navigateByUrl(this.preFixUrl + '/' + TSRouterLinks.onboarding + '/assets/edit/' + assetsId
		);
	}


	deleteAssets(id: string) {
		this.apiHandler.handleRequest(this._ownAssetsService.deleteAssetsDetails(id), ` ${this.assetNumber} deleted successfully!`).subscribe(
			{
				next: () => {
					this._analytics.addEvent(this.analyticsType.DELETED, this.analyticsScreen.OWNASSETS)
					this.listQueryParams.next_cursor = '';
					this.getAssetsList(this.listQueryParams);
					this.getCancreateAsset();
				},
				error: (error) => {
				}
			}
		);
		this.popupInputData['show'] = false;
	}


	popupFunction(data, index: any = null) {
		this.assetNumber =  data.extras.find((item) => item.id == 'display_no')?.value;
		this.listIndexData = { 'id': data.id, 'index': index };
		this.popupInputData['show'] = true;
	}

	confirmButton(event) {
		if (event) {
			let id = this.listIndexData['id'];
			this.deleteAssets(id);
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

	selectedParamsAssetsList() {
		const queryParams = this.route.snapshot.queryParams;
		this.listQueryParams = {
			search: queryParams['search'],
			status: queryParams['selectedTab'],
			next_cursor: '',
			filters: queryParams['filter']

		}
		this.getAssetsList(this.listQueryParams);
	}


	exportList(e) {
		let companyName = localStorage.getItem('companyName');
		let todaysDate = moment().format('DD-MM-YYYY')
		this._commonloaderservice.getShow();
		let queryParams = cloneDeep(this.listQueryParams)
		queryParams['export'] = true
		delete queryParams['next_cursor']
		this._ownAssetsService.getAssetsListExcel(queryParams).subscribe(resp => {
			let fileName;
			let type = 'xlsx'
			fileName = companyName + "_" + todaysDate + '.' + type;
			this._fileDownload.writeAndOpenFile(resp, fileName).then(data => {
				this._commonloaderservice.getHide();
			});
		})
	}

	onScroll(event) {
		const container = document.querySelector('.custom-table-container');
		if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoading && this.listQueryParams.next_cursor?.length > 0) {
			this.onScrollGetVehicleList(this.listQueryParams);
		}
	}



	trackById(item: any): string {
		return item.id;
	}

	onScrollGetVehicleList(params) {
		this.isLoading = true;
		this._ownAssetsService.getAssetsList(params).subscribe(data => {
			this.assetsList.push(...data['result']['assets']);
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

	activateAsset(data) {
		this.assetNumber =  data.extras.find((item) => item.id == 'display_no')?.value;
		this.apiHandler.handleRequest(this._ownAssetsService.activateAsset(data.id), `${this.assetNumber} activated successfully!`).subscribe( 
			{
				next: () => {
				  this.listQueryParams.next_cursor = '';
				  this.getAssetsList(this.listQueryParams);
				  this.getCancreateAsset();
				},
				error: () => {
				}
			}
		)
	}

	getCancreateAsset(){
		this._ownAssetsService.getCanCreateAsset().subscribe(resp => {
		  this.canCreateAsset = resp.result.can_create_asset;
		  this._createVehicle.createAsset = this.canCreateAsset;
		  this.registeredAssets = resp.result.max_assets
		})
	  }

}


