import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { changeDateToServerFormat, normalDate } from 'src/app/shared-module/utilities/date-utilis';
import { VatService } from '../../../api-services/reports-module-services/vat-service/vat.service';
import { ScreenType, OperationConstants, ScreenConstants } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ListWidgetData } from '../../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2-interface';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';

@Component({
	selector: 'app-vat-receivable',
	templateUrl: './vat-receivable.component.html',
	styleUrls: ['./vat-receivable.component.scss'],
})
export class VatReceivableComponent implements OnInit,AfterViewChecked ,OnDestroy{

	dateToday = new Date(dateWithTimeZone());
	currency_type;
	prefixUrl = getPrefix();
	analyticsType = OperationConstants;
	analyticsScreen = ScreenConstants;
	screenType = ScreenType;
	listUrl = '/reports/vat/receivable';
	listQueryParams = {
		start_date: null,
		end_date: null,
		next_cursor: '',
		search: '',
		label : '',
		status : '',
		filter : '',
	};
	isLoading = false;
	defaultParams = {
		start_date: null,
		end_date: null,
		next_cursor: '',
		search: '',
		label : '',
		status : '',
		filter : 'overall'
	};
	vatData: any = [];
	isNormalList: boolean = true;
	selectedType :string = 'overall';
	
	constructor(private router: Router, private route: ActivatedRoute, private _vatService: VatService, private _analytics: AnalyticsService, private _fileDownload: FileDownLoadAandOpen,
		private currency: CurrencyService,private _setHeight : SetHeightService,private _commonloaderService : CommonLoaderService) { }

	ngOnInit() {
		this._commonloaderService.getShow();
		this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.VATR, this.screenType.VIEW, "Navigated");
		this.prefixUrl = getPrefix();
		this.currency_type = this.currency.getCurrency();
		this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
			if (paramMap.has('search')) {
				this.selectedParamsVATList()
			} else {
				this.listQueryParams = cloneDeep(this.defaultParams)
				this.getVatReceivable(this.listQueryParams);
			}
		});
	}

	ngAfterViewChecked(): void {
		this._setHeight.setTableHeight2(['.calc-height'],'vat-list',0)
	}

	trackById(item: any): string {
		return item.id;
	}

	getVatReceivable(params) {
		this.vatData = [];
		this.listQueryParams.next_cursor = '';
		this._vatService.getVatReceivable(params).subscribe((data) => {
			if (data['result']['vat_list'].length > 0) {
				this.vatData = data['result']['vat_list']
				this.listQueryParams.next_cursor = data['result'].next_cursor;
			}
		});
	}

	dateChange(date) {
		return normalDate(date);
	}

	viewChange(event: boolean) {	
		this.isNormalList = event;
		this.selectedType = event ? 'overall' : 'expanded';
		this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.VATR, this.screenType.LIST, "VAT List View Change");
		let queryParams = new Object(
			{
				selectedTab : this.listQueryParams.status,
				start_date : this.listQueryParams.start_date,
				end_date : this.listQueryParams.end_date,
				search : this.listQueryParams.search,
				list_type : this.selectedType,
				label : this.listQueryParams.label,
			}
		);
		this.router.navigate([getPrefix() + this.listUrl], {queryParams});

	}

	exportList(e) {
		let companyName = localStorage.getItem('companyName');
		let queryParams = cloneDeep(this.listQueryParams)
		queryParams['export'] = true;
		queryParams['file_type'] = 'xlsx';
		delete queryParams['next_cursor']
		this._vatService.downloadVatReceivable(queryParams).subscribe(resp => {
			let fileName;
			const title = 'VATReceivable'
			let type = 'xlsx'
			fileName = companyName + "_" + title + "_" + (isValidValue(this.listQueryParams['start_date']) ? this.listQueryParams['start_date'] + '-To-' + this.listQueryParams['end_date'] : '' )+ '.' + type;
			this._fileDownload.writeAndOpenFile(resp, fileName).then(data => {
			});
		})
	}

	selectedParamsVATList() {
		const queryParams = this.route.snapshot.queryParams;
		this.isNormalList = queryParams['list_type'] === 'overall';
		this.selectedType = queryParams['list_type']
		this.listQueryParams = {
			status: queryParams['selectedTab'],
			start_date: changeDateToServerFormat(queryParams['start_date']),
			end_date: changeDateToServerFormat(queryParams['end_date']),
			search: queryParams['search'],
			next_cursor: '',
			filter : queryParams['list_type'],
			label : queryParams['label'],
		}
		this.getVatReceivable(this.listQueryParams);
	}

	listWidgetData(widgetData: ListWidgetData) {
		let queryParams = new Object(
			{
				selectedTab: widgetData.tabSelection,
				start_date: widgetData.dateRange.startDate,
				end_date: widgetData.dateRange.endDate,
				search: widgetData.searchValue,
				list_type: this.selectedType,
				label : widgetData.dateRange.selectedOpt,
			}
		);
		this.router.navigate([getPrefix() + this.listUrl], { queryParams });
	}

	onScroll() {
		const container = document.querySelector('.custom-table-container');
		if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoading && this.listQueryParams.next_cursor?.length > 0) {
			this.onScrollGetTripList(this.listQueryParams);
		}
	}

	onScrollGetTripList(params) {
		this.isLoading = true;
		this._vatService.getVatReceivable(params).subscribe((data) => {
			this.vatData.push(...data['result'].vat_list);
			this.listQueryParams.next_cursor = data['result'].next_cursor;
			this.isLoading = false;
		})
	}

	ngOnDestroy(): void {
		this._commonloaderService.getShow();
	}

}

