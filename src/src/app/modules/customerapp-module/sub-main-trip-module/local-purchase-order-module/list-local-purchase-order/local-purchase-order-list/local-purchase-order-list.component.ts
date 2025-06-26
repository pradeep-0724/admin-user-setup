import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { PrefixUrlService, getPrefix } from 'src/app/core/services/prefixurl.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { ButtonData, ListWidgetData } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2-interface';
import { cloneDeep } from 'lodash';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { LpoService } from 'src/app/modules/customerapp-module/api-services/trip-module-services/lpo-services/lpo.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';


@Component({
	selector: 'app-local-purchase-order-list',
	templateUrl: './local-purchase-order-list.component.html',
	styleUrls: ['./local-purchase-order-list.component.scss'],
	host: {
		'(document:click)': 'outSideClick($event)',
	}
})
export class LocalPurchaseOrderListComponent implements OnInit, OnDestroy {

	prefixUrl = getPrefix();
	showOptions: any;
	listUrl = '/trip/local-purchase-order/list';
	filterUrl = 'operation/lpo/filters/'
	settingsUrl = 'operation/lpo/setting/'
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
		name: 'Add LPO',
		permission: Permission.localPurchaseOrder.toString().split(',')[0],
		url: this.prefixUrl + '/trip/local-purchase-order/add'
	};
	lpoList: any = [];
	popupInputData = {
		'msg': 'Are you sure, you want to delete?',
		'type': 'warning',
		'show': false
	}
	popupInputDataClose = {
		'msg': 'A closed Local Purchase order cannot be reopened again. Are you sure, you want to close the Local Purchase order?',
		'type': 'warning',
		'show': false
	};
	popupOutputData: any;
	listIndexData = {};
	preFixUrl = ''
	analyticsType = OperationConstants;
	analyticsScreen = ScreenConstants;
	screenType = ScreenType;
	lpoPermission = Permission.localPurchaseOrder.toString().split(',');
	lpoListHeader = [];
	currency_type;
	lpoLable = '';


	constructor(private setHeight: SetHeightService, private _analytics: AnalyticsService, private route: ActivatedRoute,
		private _router: Router, private _prefixUrl: PrefixUrlService,
		private _commonloaderservice: CommonLoaderService, private apiHandler: ApiHandlerService,
		private _lpoService: LpoService, private currency: CurrencyService
	) { }

	ngOnDestroy(): void {
		this._commonloaderservice.getShow();
	}
	ngAfterViewChecked() {
		this.setHeight.setTableHeight2(['.calc-height'], 'lpo-list', 0);
	}

	ngOnInit() {
		this.currency_type = this.currency.getCurrency();
		this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.CONTAINER, this.screenType.LIST, "Navigated");
		this.preFixUrl = this._prefixUrl.getprefixUrl();
		this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
			if (paramMap.has('search')) {
				this.selectedParamsLpoList();
			} else {
				this.listQueryParams = cloneDeep(this.defaultParams)
				this.getLpoList(this.listQueryParams);

			}
		});

	}

	settingsApplied(event: boolean) {
		if (event) {
			this.listQueryParams.next_cursor = '';
			this.getLpoList(this.listQueryParams);
		}
	}

	getLpoList(params) {
		this.lpoList = [];
		this.lpoListHeader = [];
		this.listQueryParams.next_cursor = '';
		this._lpoService.getLpoList(params).subscribe((data) => {
			this.lpoListHeader = data['result']['column'];
			if (data['result'].lpo_list.length) {
				this.lpoList = data['result']['lpo_list'];
				this.listQueryParams.next_cursor = data['result']['next_cursor']
			}
		});
	}
	selectedParamsLpoList() {
		const queryParams = this.route.snapshot.queryParams;
		this.listQueryParams = {
			search: queryParams['search'],
			next_cursor: '',
			filters: queryParams['filter']

		}
		this.getLpoList(this.listQueryParams);
	}


	deleteLpo(id: string) {
		this.apiHandler.handleRequest(this._lpoService.deleteLpo(id), `${this.lpoLable} deleted successfully!`).subscribe(
			{
				next: () => {
					this._analytics.addEvent(this.analyticsType.DELETED, this.analyticsScreen.CONTAINER)
					this.getLpoList(this.listQueryParams);
				},
				error: () => {
					this.popupInputData['show'] = false;
				},
			}
		)
	}


	popupFunction(data, index: any = null) {
		this.lpoLable = data.extras.find(item => item.id == 'lpo_no')?.value?.name;		
		this.listIndexData = { 'id': data.id, 'index': index };
		this.popupInputData['show'] = true;
	}

	confirmButton(event) {
		if (event) {
			let id = this.listIndexData['id'];
			this.deleteLpo(id);
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
	onScroll(event) {
		const container = document.querySelector('.custom-table-container');
		if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoading && this.listQueryParams.next_cursor?.length > 0) {
			this.onScrollGetLpoList(this.listQueryParams);
		}
	}



	trackById(item: any): string {
		return item.id;
	}

	onScrollGetLpoList(params) {
		this.isLoading = true;
		this._lpoService.getLpoList(params).subscribe(data => {
			this.lpoList.push(...data['result']['lpo_list']);
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
	lpoClose(event) {

		if (event) {
			this.apiHandler.handleRequest(this._lpoService.closeLpo(this.listIndexData['id']), ` ${this.lpoLable} LPO closed successfully!`).subscribe(
				{
					next: () => {
						this.getLpoList(this.listQueryParams);
						this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.CONTAINER, this.screenType.LIST, "LPO Closed");
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
	closeLpo(data, i) {
		this.lpoLable = data.extras.find(item => item.id == 'lpo_no')?.value?.name;		
		this.listIndexData = { 'id': data.id, 'index': i };
		this.popupInputDataClose['show'] = true;

	}

	getStatus(lpo) {
		return lpo?.extras.filter(e => e.name == 'Status')[0]['value']
	}


}


