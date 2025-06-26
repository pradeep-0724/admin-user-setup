import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { normalDate } from 'src/app/shared-module/utilities/date-utilis';
import { PrefixUrlService, getPrefix } from 'src/app/core/services/prefixurl.service';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { ButtonData, ListWidgetData } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2-interface';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { cloneDeep } from 'lodash';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { RateCardServiceService } from '../../rate-card-service.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-rate-card-list',
  templateUrl: './rate-card-list.component.html',
  styleUrls: ['./rate-card-list.component.scss'],
  host: {
		'(document:click)': 'outSideClick($event)',
	}
})
export class RateCardListComponent implements OnInit {

	showOptions: string = '';
	popupInputData = {
		'msg': 'Are you sure, you want to delete?',
		'type': 'warning',
		'show': false
	};
	prefixUrl = getPrefix();
	buttonData: ButtonData = {
		name: 'Add Rate Card',
		permission: Permission.rate_card.toString().split(',')[0],
		url: this.prefixUrl + '/onboarding/rate-card/add'
	};
	popupOutputData: any;
	listIndexData = {};
	apiError: String = "";
	analyticsType = OperationConstants;
	analyticsScreen = ScreenConstants;
	screenType = ScreenType;
	listUrl = '/onboarding/rate-card/list';
	listQueryParams = {
		next_cursor: '',
		search: '',
	};
	isLoading = false;
	defaultParams = {
		next_cursor: '',
		search: '',
	};
	rateCardListDetails = [];
	rateCardPermission = Permission.rate_card.toString().split(',');
	rateCardName = '';
	
	constructor(private _rateCardService: RateCardServiceService, private _analytics: AnalyticsService, private _prefixUrl: PrefixUrlService, private _popupBodyScrollService: popupOverflowService, private router: Router, private route: ActivatedRoute,
		private commonloaderservice: CommonLoaderService,private _setHeight:SetHeightService,private apiHandler: ApiHandlerService) { }

	ngOnDestroy(): void {
		this.commonloaderservice.getShow()
	}

	ngAfterViewChecked(): void {
		this._setHeight.setTableHeight2(['.calc-height'],'rate-card-list',0)
	}

	ngOnInit() {
		this.commonloaderservice.getHide();
		this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.RATECARD, this.screenType.LIST, "Navigated");
		this.prefixUrl = this._prefixUrl.getprefixUrl();
		this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
			if (paramMap.has('search')) {
				this.selectedParamsRateCardList()
			} else {
				this.listQueryParams = cloneDeep(this.defaultParams)
				this.getAllRateCardListDetails(this.listQueryParams);
			}
		});
	}

	trackById(item: any): string {
	   return item.id;
	}

	getAllRateCardListDetails(params) {
		this.rateCardListDetails = [];
		this.listQueryParams.next_cursor = '';
		this._rateCardService.getRentalRateCardList(params).subscribe((data) => {	
			if(data['result'].ratecards.length>0){
			    this.rateCardListDetails =data['result'].ratecards     
			    this.listQueryParams.next_cursor = data['result'].next_cursor;
			}
		});
	}

	dateChange(date) {
		return normalDate(date);
	}


	optionsList(event, list_index) {
		return this.showOptions = list_index;
	}

	outSideClick(env) {
		if ((env.target.className).indexOf('more-icon') == -1)
			this.showOptions = ''
	}

	selectedParamsRateCardList() {
		const queryParams = this.route.snapshot.queryParams;
		this.listQueryParams = {
			search: queryParams['search'],
			next_cursor: '',
		}
		this.getAllRateCardListDetails(this.listQueryParams);
	}

	listWidgetData(widgetData: ListWidgetData) {
		let queryParams = new Object(
			{
				selectedTab: widgetData.tabSelection,
				search: widgetData.searchValue,
				filter: JSON.stringify(widgetData.filterKeyData),
			}
		);
		this.router.navigate([getPrefix() + this.listUrl], { queryParams });
	}

	onScroll() {
		const container = document.querySelector('.custom-table-container');
		if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoading && this.listQueryParams.next_cursor?.length > 0) {
			this.onScrollGetrateCardList(this.listQueryParams);
		}
	}

	onScrollGetrateCardList(params) {
		this.isLoading = true;
		this._rateCardService.getRentalRateCardList(params).subscribe((data) => {
			this.rateCardListDetails.push(...data['result'].ratecards);
			this.listQueryParams.next_cursor = data['result'].next_cursor;
			this.isLoading = false;
		})
	}

	deleterateCard(partyId: string) {
		this.apiHandler.handleRequest(this._rateCardService.deleteRentalRateCard(partyId), `${this.rateCardName} deleted successfully!`).subscribe(
			{
				next: () => {
					this._analytics.addEvent(this.analyticsType.DELETED, this.analyticsScreen.RATECARD)
					this.listQueryParams.next_cursor = ''
					this.getAllRateCardListDetails(this.listQueryParams)
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


	popupFunction(rateCard, index: any = null) {
		this.rateCardName = rateCard.name;
		this.listIndexData = { 'id': rateCard.id, 'index': index };
		this.popupInputData['show'] = true;
		this._popupBodyScrollService.popupActive()
	}

	confirmButton(event) {
		this.commonloaderservice.getShow()
		if (event) {
			let id = this.listIndexData['id'];
			this.deleterateCard(id);
			this.listIndexData = {};
			this.commonloaderservice.getHide()
		}
	}

}
