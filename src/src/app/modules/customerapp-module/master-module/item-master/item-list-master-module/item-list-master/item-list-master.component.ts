import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { PrefixUrlService, getPrefix } from 'src/app/core/services/prefixurl.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { ButtonData, ListWidgetData } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2-interface';
import { cloneDeep } from 'lodash';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { ItemMasterService } from 'src/app/modules/customerapp-module/api-services/master-module-services/item-service/item.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';


@Component({
	selector: 'app-item-list-master',
  templateUrl: './item-list-master.component.html',
  styleUrls: ['./item-list-master.component.scss'],
	host: {
		'(document:click)': 'outSideClick($event)',
	}
})
export class ItemListMasterComponent implements OnInit, OnDestroy {

	prefixUrl = getPrefix();
	showOptions: any;
	listUrl = '/onboarding/item/list';
	filterUrl = 'item/filters/'
	defaultParams = {
		next_cursor: '',
		search: '',
		filters: '[]'
	};

	listQueryParams = {
		next_cursor: '',
		search: '',
		filters: '[]'
	}
	isLoading = false;
	buttonData: ButtonData = {
		name: 'Add Item',
		permission: Permission.item.toString().split(',')[0],
		url: this.prefixUrl + '/onboarding/item/add'
	};
	itemList: any = [];
	popupInputData = {
		'msg': 'Are you sure, you want to delete?',
		'type': 'warning',
		'show': false
	}
	popupOutputData: any;
	listIndexData = {};
	apiError: String = "";
	preFixUrl = ''
	analyticsType = OperationConstants;
	analyticsScreen = ScreenConstants;
	screenType = ScreenType;
	itemPermissions = Permission.item.toString().split(',');
	settingsUrl = 'item/settings/';
	itemListHeader = [];



	constructor(private setHeight: SetHeightService, private _analytics: AnalyticsService, private route: ActivatedRoute,
		private _router: Router, private _prefixUrl: PrefixUrlService,private apiHandler: ApiHandlerService,
		private _commonloaderservice: CommonLoaderService,  private _itemsService:ItemMasterService
	) { }

	ngOnDestroy(): void {
		this._commonloaderservice.getShow();
	}
	ngAfterViewChecked() {
		this.setHeight.setTableHeight2(['.calc-height'], 'item-list', 0);
	}

	ngOnInit() {
		this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.OWNASSETS, this.screenType.LIST, "Navigated");
		this.preFixUrl = this._prefixUrl.getprefixUrl();
		this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
			if (paramMap.has('search')) {
				this.selectedParamsitemList();
			} else {
				this.listQueryParams = cloneDeep(this.defaultParams)
				this.getitemList(this.listQueryParams);

			}
		});
	}

	settingsApplied(event: boolean) {
		if (event) {
			this.listQueryParams.next_cursor = '';
			this.getitemList(this.listQueryParams);
		}
	}

	getitemList(params) {
		this.itemListHeader = [];
		this.itemList = [];
		this._itemsService.getItemsList(params).subscribe((data) => {
			this.itemListHeader = data['result']['column']

			if (data['result'].item_list.length) {
				this.itemList = data['result']['item_list'];
				this.listQueryParams.next_cursor = data['result']['next_cursor']
			}
		});
	}


	editItem(itemId) {
		this._router.navigateByUrl(this.preFixUrl +'/' +TSRouterLinks.onboarding +'/item/edit/'+itemId);
	}


	deleteItem(id: string) {
		this.apiHandler.handleRequest(this._itemsService.deleteItem(id), '').subscribe(
			{
				next: () => {
					this._analytics.addEvent(this.analyticsType.DELETED, this.analyticsScreen.ITEM)
					this.listQueryParams.next_cursor = '';
					this.getitemList(this.listQueryParams);
				},
				error: (error) => {
					this.apiError = error['error']['message'];
					this.popupInputData['show'] = false;
					setTimeout(() => {
						this.apiError = '';
					}, 10000);
				}
			}
		);
	}


	popupFunction(data, index: any = null) {
		this.listIndexData = { 'id': data.id, 'index': index };
		this.popupInputData['show'] = true;
	}

	confirmButton(event) {
		if (event) {
			let id = this.listIndexData['id'];
			this.deleteItem(id);
			this.listIndexData = {};
		}
	}

	listWidgetData(widgetData: ListWidgetData) {
		let queryParams = new Object(
			{
				search: widgetData.searchValue,
				filter: JSON.stringify(widgetData.filterKeyData)
			}
		);
		this._router.navigate([getPrefix() + this.listUrl], { queryParams });
	}

	selectedParamsitemList() {
		const queryParams = this.route.snapshot.queryParams;
		this.listQueryParams = {
			search: queryParams['search'],
			next_cursor: '',
			filters: queryParams['filter']

		}
		this.getitemList(this.listQueryParams);
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
		this._itemsService.getItemsList(params).subscribe(data => {
			this.itemList.push(...data['result']['item_list']);
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


