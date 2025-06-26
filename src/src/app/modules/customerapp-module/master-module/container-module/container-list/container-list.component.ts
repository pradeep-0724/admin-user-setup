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
import { ContainerService } from '../../../api-services/master-module-services/container-service/container-service.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';


@Component({
	selector: 'app-container-list',
	templateUrl: './container-list.component.html',
	styleUrls: ['./container-list.component.scss'],
	host: {
		'(document:click)': 'outSideClick($event)',
	}
})
export class ContainerListComponent implements OnInit, OnDestroy {

	prefixUrl = getPrefix();
	showOptions: any;
	listUrl = '/onboarding/container/list/';
	filterUrl = 'container/filters/'
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
		name: 'Add Container',
		permission: Permission.container.toString().split(',')[0],
		url: this.prefixUrl + '/onboarding/container/add'
	};
	containerList: any = [];
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
	containerPermission = Permission.assets.toString().split(',');
	containerName = '';



	constructor(private setHeight: SetHeightService, private _analytics: AnalyticsService, private route: ActivatedRoute,
		private _router: Router, private _prefixUrl: PrefixUrlService,
		private _commonloaderservice: CommonLoaderService, private _containerService: ContainerService,private apiHandler: ApiHandlerService,
	) { }

	ngOnDestroy(): void {
		this._commonloaderservice.getShow();
	}
	ngAfterViewChecked() {
		this.setHeight.setTableHeight2(['.calc-height'], 'containers-list', 0);
	}

	ngOnInit() {
		this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.CONTAINER, this.screenType.LIST, "Navigated");
		this.preFixUrl = this._prefixUrl.getprefixUrl();
		this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
			if (paramMap.has('search')) {
				this.selectedParamsContainersList();
			} else {
				this.listQueryParams = cloneDeep(this.defaultParams)
				this.getContainersList(this.listQueryParams);

			}
		});

	}

	settingsApplied(event: boolean) {
		if (event) {
			this.listQueryParams.next_cursor = '';
			this.getContainersList(this.listQueryParams);
		}
	}

	getContainersList(params) {
		this.containerList = [];
		this._containerService.getContainerList(params).subscribe((data) => {
			if (data['result'].containers.length) {
				this.containerList = data['result']['containers'];
				this.listQueryParams.next_cursor = data['result']['next_cursor']
			}
		});
	}
	selectedParamsContainersList() {
		const queryParams = this.route.snapshot.queryParams;
		this.listQueryParams = {
			search: queryParams['search'],
			next_cursor: '',
			filters: queryParams['filter']

		}
		this.getContainersList(this.listQueryParams);
	}


	deleteContainer(id: string) {
		this.apiHandler.handleRequest(this._containerService.deleteContainer(id),` ${this.containerName} deleted successfully!`).subscribe(
			{
				next: () => {
					this._analytics.addEvent(this.analyticsType.DELETED, this.analyticsScreen.CONTAINER)
					this.listQueryParams.next_cursor = '';
					this.getContainersList(this.listQueryParams);
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
		this.containerName = data.name;
		this.listIndexData = { 'id': data.id, 'index': index };
		this.popupInputData['show'] = true;
	}

	confirmButton(event) {
		if (event) {
			let id = this.listIndexData['id'];
			this.deleteContainer(id);
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
			this.onScrollGetContainersList(this.listQueryParams);
		}
	}



	trackById(item: any): string {
		return item.id;
	}

	onScrollGetContainersList(params) {
		this.isLoading = true;
		this._containerService.getContainerList(params).subscribe(data => {
			this.containerList.push(...data['result']['containers']);
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


