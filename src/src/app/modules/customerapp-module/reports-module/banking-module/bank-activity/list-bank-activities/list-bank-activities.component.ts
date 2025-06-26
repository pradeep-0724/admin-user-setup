import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { BankingService } from '../../../../api-services/reports-module-services/banking-service/banking.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { cloneDeep } from 'lodash';
import { ButtonData, ListWidgetData } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2-interface';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { changeDateToServerFormat, normalDate } from 'src/app/shared-module/utilities/date-utilis';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';

@Component({
  selector: 'app-list-bank-activities',
  templateUrl: './list-bank-activities.component.html',
  styleUrls: ['./list-bank-activities.component.scss'],
  host: {
		'(document:click)': 'outSideClick($event)',
	  }
})
export class ListBankActivitiesComponent implements OnInit,AfterViewChecked,OnDestroy {
  showOptions: string = '';
  bankActivityList: any = [];
  currency_type;
  listIndexData = {};
  popupInputData = {
    'msg': 'Are you sure, you want to delete?',
    'type': 'warning',
    'show': false
  }
  apiError=''
  prefixUrl = getPrefix();
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;
  screenType=ScreenType;
  buttonData: ButtonData = {
    name: 'Add Bank Activity',
    permission: Permission.bankactivity.toString().split(',')[0],
    url: this.prefixUrl+ '/bankactivity/add'
  };
  filterUrl = 'revenue/bank-activity/filters/'
  listUrl = '/bankactivity/list';
  listQueryParams = {
    start_date: '',
    end_date: '',
    next_cursor: '',
    search: '',
    filters: '',
    label : ''
  };
  isLoading = false;
  defaultParams = {
    start_date: null,
    end_date: null,
    next_cursor: '',
    search: '',
    filters: '',
    label : '' 

  };

  constructor(private _setHeight:SetHeightService, private bankService: BankingService,  private currency:CurrencyService,
    private _router: Router, private _popupBodyScrollService:popupOverflowService,private _analytics:AnalyticsService,
    private route : ActivatedRoute,private _commonloaderService :  CommonLoaderService) { }
  
    ngOnDestroy(): void {
    this._commonloaderService.getShow();
  }

  ngOnInit() {   
    this._commonloaderService.getHide(); 
     this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.BANKACTIVITY,this.screenType.LIST,"Navigated");
     setTimeout(() => {
      this.currency_type = this.currency.getCurrency();
    }, 1000);
    this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
			if (paramMap.has('search')) {
				this.selectedParamsPartyList()
			} else {
				this.listQueryParams = cloneDeep(this.defaultParams)
				this.getBankActivityList(this.listQueryParams);
			}
		});
  }

  ngAfterViewChecked(): void {
    this._setHeight.setTableHeight2(['.calc-height'],'bank-activity-table',0)
  }
  optionsList(event, list_index){
		return this.showOptions = list_index;
  }

  outSideClick(env){
		if((env.target.className).indexOf('more-icon') == -1)
			this.showOptions =''
  }

  editBankActivity(bankId) {
		this._router.navigateByUrl(this.prefixUrl+'/'+
        TSRouterLinks.report +
        '/' +
				TSRouterLinks.report_bank_activity +
        '/' +
				TSRouterLinks.report_bank_activity_edit +
				'/' +
				bankId
		);
  }


  popupFunction(id, index: any = null) {
    this.listIndexData = { 'id': id, 'index': index };
    this.popupInputData['show'] = true;
    this._popupBodyScrollService.popupActive()
  }

  confirmButton(event) {
    if (event) {
      let id = this.listIndexData['id'];
      this.deleteRecord(id);
      this.listIndexData = {};
    }
  }

  deleteRecord(id) {
    this.bankService.deleteBankActivityById(id).subscribe(
      data => {
        this._analytics.addEvent(this.analyticsType.DELETED,this.analyticsScreen.BANKACTIVITY)
        this.getBankActivityList(this.listQueryParams);
      },
      error => {
        this.apiError = error['error']['message'];
        this.popupInputData['show'] = false;
        setTimeout(() => {
          this.apiError = '';
        }, 100);
      }
    );
  }
  



  getBankActivityList(params) {
		this.bankActivityList = [];
		this.listQueryParams.next_cursor = '';
		this.bankService.getBankActivities(params).subscribe((data) => {			
			this.bankActivityList =data['result'].ba      
			this.listQueryParams.next_cursor = data['result'].next_cursor;
		});
	}


  selectedParamsPartyList() {
		const queryParams = this.route.snapshot.queryParams;
		this.listQueryParams = {
			search: queryParams['search'],
			next_cursor: '',
			filters: queryParams['filter'],
      start_date: changeDateToServerFormat(queryParams['start_date']),
      end_date: changeDateToServerFormat(queryParams['end_date']),
      label : queryParams['label'],
      
		}
		this.getBankActivityList(this.listQueryParams);
	}

	listWidgetData(widgetData: ListWidgetData) {    
		let queryParams = new Object(
			{
				selectedTab: widgetData.tabSelection,
				search: widgetData.searchValue,
        start_date: widgetData.dateRange.startDate,
        end_date: widgetData.dateRange.endDate,
				filter: JSON.stringify(widgetData.filterKeyData),
        label : widgetData.dateRange.selectedOpt,
			}
		);
		this._router.navigate([getPrefix() + this.listUrl], { queryParams });
	}

	onScroll() {
		const container = document.querySelector('#bank-activity-table');
		if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoading && this.listQueryParams.next_cursor?.length > 0) {
			this.onScrollGetTripList(this.listQueryParams);
		}
	}

	onScrollGetTripList(params) {
		this.isLoading = true;
		this.bankService.getBankActivities(params).subscribe((data) => {
			this.bankActivityList.push(...data['result'].ba);
			this.listQueryParams.next_cursor = data['result'].next_cursor;
			this.isLoading = false;
		})
	}

  changeDate(date:string){
    return normalDate(date)
  }
}
