import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { PartyService } from '../../../../api-services/master-module-services/party-service/party.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { normalDate } from 'src/app/shared-module/utilities/date-utilis';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { PrefixUrlService, getPrefix } from 'src/app/core/services/prefixurl.service';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { ButtonData, DropDownType, ListWidgetData } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2-interface';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
	selector: 'app-party-list',
	templateUrl: './party-list.component.html',
	styleUrls: [
		'./party-list.component.scss'
	],
	host: {
		'(document:click)': 'outSideClick($event)',
	}
})
export class PartyListComponent implements OnInit, OnDestroy,AfterViewChecked {
	showOptions: string = '';
	partyPer = Permission.party.toString().split(',');
	videoUrl = "https://ts-pub-directory.s3.ap-south-1.amazonaws.com/Party.mp4";
	popupInputData = {
		'msg': 'Are you sure, you want to delete?',
		'type': 'warning',
		'show': false
	};
	tabSelectionList: Array<DropDownType> = [
		{
			label: "Parties",
			value: "2",
		},
		{
			label: "Customers",
			value: "0",
		},
		{
			label: "Vendors",
			value: "1",
		},
	];
	popupOutputData: any;
	listIndexData = {};
	apiError: String = "";
	prefixUrl = getPrefix();
	analyticsType = OperationConstants;
	analyticsScreen = ScreenConstants;
	screenType = ScreenType;
	partyType = '';
	goThroughDetais = {
		show: false,
		url: "https://demo.arcade.software/La6OqQ5AHBg01Sj3jtbw?embed%22"
	};
	buttonData: ButtonData = {
		name: 'Add Party',
		permission: Permission.party.toString().split(',')[0],
		url: this.prefixUrl + '/onboarding/party/add'
	};
	listUrl = '/onboarding/party/view';
	listQueryParams = {
		next_cursor: '',
		search: '',
		filters: '',
		status: '2'
	};
	isLoading = false;
	defaultParams = {
		next_cursor: '',
		search: '',
		filters: '',
		status: '2'
	};
	partyListDetails = [];
    settingsUrl = 'party/setting/v2/';
	partyHeader = [];

	constructor(private _fileDownload: FileDownLoadAandOpen,private _partyService: PartyService, private _analytics: AnalyticsService, private _prefixUrl: PrefixUrlService, private _popupBodyScrollService: popupOverflowService, private router: Router, private route: ActivatedRoute,
		private commonloaderservice: CommonLoaderService,private _setHeight:SetHeightService,private apiHandler: ApiHandlerService) { }
	ngOnDestroy(): void {
		this.commonloaderservice.getShow()
	}
	ngAfterViewChecked(): void {
		this._setHeight.setTableHeight2(['.calc-height'],'party-list',0)
		
	}

	ngOnInit() {
		this.commonloaderservice.getHide();
		this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.PARTY, this.screenType.LIST, "Navigated");
		this.prefixUrl = this._prefixUrl.getprefixUrl();
		this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
			if (paramMap.has('selectedTab')) {
				this.selectedParamsPartyList()
			} else {
				this.listQueryParams = cloneDeep(this.defaultParams)
				this.getAllPartyList(this.listQueryParams);
			}
		});
	}

	settingsApplied(event: boolean) {
		if (event) {
		  this.listQueryParams.next_cursor = '';
		  this.getAllPartyList(this.listQueryParams);
		}
	  }
	
	trackById(item: any): string {
	   return item.id;
	}

	getAllPartyList(params) {
		this.partyListDetails = [];
		this.partyHeader = [];
		this.listQueryParams.next_cursor = '';
		this._partyService.getPartyDetailsV2(params).subscribe((data) => {	
			this.partyHeader = data['result']['column']
		
			if(data['result'].party.length>0){
			    this.partyListDetails =data['result'].party      
			    this.listQueryParams.next_cursor = data['result'].next_cursor;
			}
		});
	}

	dateChange(date) {
		return normalDate(date);
	}


	openGothrough() {
		this.goThroughDetais.show = true;
	}
	exportList(e) {
		let companyName = localStorage.getItem('companyName');
		let selectionType=this.listQueryParams.status == '0' ? 'Customers' : this.listQueryParams.status == '1' ? 'Vendors':'Parties'
		let todaysDate = moment().format('DD-MM-YYYY')
		this.commonloaderservice.getShow();
		let queryParams = cloneDeep(this.listQueryParams)
		queryParams['export']=true
		delete queryParams['next_cursor']
		this._partyService.getPartyListExcel(queryParams).subscribe(resp => {
			let fileName;
			let type = 'xlsx'
			fileName = companyName + "_" + selectionType + "_" + todaysDate + '.' + type;
			this._fileDownload.writeAndOpenFile(resp, fileName).then(data => {
				this.commonloaderservice.getHide();
			});
		})
	}


	editParty(partyId) {
		this.router.navigateByUrl(this.prefixUrl +
			'/' +
			TSRouterLinks.onboarding +
			'/' +
			TSRouterLinks.master_party +
			'/' +
			TSRouterLinks.master_party_edit +
			'/' +
			partyId
		);
	}

	optionsList(event, list_index) {
		return this.showOptions = list_index;
	}

	outSideClick(env) {
		if ((env.target.className).indexOf('more-icon') == -1)
			this.showOptions = ''
	}
	selectedParamsPartyList() {
		const queryParams = this.route.snapshot.queryParams;
		this.listQueryParams = {
			search: queryParams['search'],
			next_cursor: '',
			filters: queryParams['filter'],
			status: queryParams['selectedTab']
		}
		this.getAllPartyList(this.listQueryParams);
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
			this.onScrollGetTripList(this.listQueryParams);
		}
	}

	onScrollGetTripList(params) {
		this.isLoading = true;
		this._partyService.getPartyDetailsV2(params).subscribe((data) => {
			this.partyListDetails.push(...data['result'].party);
			this.listQueryParams.next_cursor = data['result'].next_cursor;
			this.isLoading = false;
		})
	}

	deleteParty(partyId: string) {
		this.apiHandler.handleRequest(this._partyService.deleteParty(partyId), 'Party deleted successfully!').subscribe(
			{
				next: () => {
					if (this.partyType == 'Customer') {
						this._analytics.addEvent(this.analyticsType.DELETED, this.analyticsScreen.CLIENTPARTIES)
					} else {
						this._analytics.addEvent(this.analyticsType.DELETED, this.analyticsScreen.VENDORPARTIES)
					}
					this.listQueryParams.next_cursor = ''
					this.getAllPartyList(this.listQueryParams)
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

	generateURL(party) {
		if (party.party_type == 'Customer') {
			return this.prefixUrl + '/onboarding/party/details/client/' + party.id;
		} else if (party.party_type == 'Vendor') {
			return this.prefixUrl + '/onboarding/party/details/vendor/' + party.id;

		} else {
			return '';
		}
	}


	popupFunction(party, index: any = null) {
		this.listIndexData = { 'id': party.id, 'index': index };
		this.popupInputData['show'] = true;
		this.partyType = party.party_type;
		this._popupBodyScrollService.popupActive()
	}

	confirmButton(event) {
		this.commonloaderservice.getShow()
		if (event) {
			let id = this.listIndexData['id'];
			this.deleteParty(id);
			this.listIndexData = {};
			this.commonloaderservice.getHide()
		}
	}

}
