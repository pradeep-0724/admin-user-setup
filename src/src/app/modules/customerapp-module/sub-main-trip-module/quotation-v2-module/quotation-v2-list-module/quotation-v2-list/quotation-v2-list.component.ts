import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { ButtonData, DropDownType, ListWidgetData } from '../../../new-trip-v2/list-module-v2/list-module-v2-interface';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { cloneDeep } from 'lodash';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { QuotationV2Service } from '../../../../api-services/trip-module-services/quotation-service/quotation-service-v2';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { QuotationService } from '../../../../api-services/trip-module-services/quotation-service/quotation-service';
import { ScreenConstants, ScreenType, OperationConstants } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-quotation-v2-list',
  templateUrl: './quotation-v2-list.component.html',
  styleUrls: ['./quotation-v2-list.component.scss']
})
export class QuotationV2ListComponent implements OnInit  ,OnDestroy,AfterViewChecked{
  filterUrl = 'quotation/filters/'
  listUrl = '/trip/quotation/list'
  settingsUrl='quotation/setting/'
  defaultParams = {
    start_date: null,
    end_date:null,
    next_cursor: '',
    search: '',
    status: '0',
    filters: [],
    label :''
  };
  listQueryParams = {
    start_date: '',
    end_date: '',
    next_cursor: '',
    status: '0',
    search: '',
    filters: [],
    label :''
  }
  quotationList = [];
  quotationHeaders=[]
  isLoading = false;
  tabSelectionList: Array<DropDownType> = [
    {
      label: "All Quotation",
      value: "0",
    },
  ];
  deleteQuotationId;
  popupInputData = {
    'msg': 'Are you sure, you want to delete?',
    'type': 'warning',
    'show': false
  }
  goThroughDetais = {
    show: false,
    url: "https://demo.arcade.software/lYimjVv1eM1D2myZMl8P?embed%22"
  }
  prefixUrl = getPrefix();
  buttonData: ButtonData = {
    name: 'Add Quotation',
    permission: Permission.quotations.toString().split(',')[0],
    url: this.prefixUrl + '/trip/quotation/add'
  }
  quotation = Permission.quotations.toString().split(',');
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  analyticsType = OperationConstants;
	currency_type;
  quotationLabel = '';

  constructor(private _analytics: AnalyticsService, private commonloaderservice: CommonLoaderService, private router: Router, private route: ActivatedRoute, private _quotationV2Service: QuotationV2Service,private apiHandler: ApiHandlerService,
    private _quotationService: QuotationService,private currency: CurrencyService,private _setHeight:SetHeightService,private _commonloaderservice:CommonLoaderService,private _fileDownload:FileDownLoadAandOpen) { }

  ngOnInit(): void {
    this.currency_type = this.currency.getCurrency();
    setTimeout(() => {
    this.commonloaderservice.getHide();
    }, 400);
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.QUOTATION,this.screenType.LIST,"Navigated");
    this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('selectedTab')) {
        this.selectedParamsTripList()
      } else {
        this.listQueryParams = cloneDeep(this.defaultParams)
        this.getQuotationList(this.listQueryParams);
      }
    });
  }
  ngAfterViewChecked(): void {
    this._setHeight.setTableHeight2(['.calc-height'],"quotation-list",0)
  }

  listWidgetData(widgetData: ListWidgetData) {    
    let queryParams = new Object(
      {
        start_date: widgetData.dateRange.startDate,
        end_date: widgetData.dateRange.endDate,
        search: widgetData.searchValue,
        filter: JSON.stringify(widgetData.filterKeyData),
        selectedTab: widgetData.tabSelection,
        label : widgetData.dateRange.selectedOpt
      }
    );
    this.router.navigate([getPrefix() + this.listUrl], { queryParams });
  }
  openGothrough() {
    this.goThroughDetais.show = true;
  }

  ngOnDestroy(): void {
    this.commonloaderservice.getShow();
  }
  selectedParamsTripList() {
    const queryParams = this.route.snapshot.queryParams;
    this.listQueryParams = {
      start_date: changeDateToServerFormat(queryParams['start_date']),
      end_date: changeDateToServerFormat(queryParams['end_date']),
      search: queryParams['search'],
      next_cursor: '',
      status: queryParams['selectedTab'],
      filters: queryParams['filter'],
      label : queryParams['label'],

    }
    this.getQuotationList(this.listQueryParams);
  }
  settingsApplied(event: boolean) {
		if (event) {
			this.listQueryParams.next_cursor = '';
			this.getQuotationList(this.listQueryParams);
		}
	}

  getQuotationList(params) {
    this.quotationList=[];
    this.listQueryParams.next_cursor=''
    this._quotationV2Service.getQuotationList(params).subscribe((data) => {
      this.quotationList = data['result'].qos;
      this.quotationHeaders=data['result'].column;
      params.next_cursor = data['result'].next_cursor;
    });
  }
  exportList(e) {
		let companyName = localStorage.getItem('companyName');
		this._commonloaderservice.getShow();
		let queryParams = cloneDeep(this.listQueryParams)
		queryParams['export']=true
		delete queryParams['next_cursor']
		this._quotationV2Service.getQuotationListExcel(queryParams).subscribe(resp => {
			let fileName;
			let type = 'xlsx'
			fileName = companyName + "_" +'Quotation_List' + '.' + type;
			this._fileDownload.writeAndOpenFile(resp, fileName).then(data => {
				this._commonloaderservice.getHide();
			});
		})
	}

  onScroll(event) {
    const container = document.querySelector('.quotation-list');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoading && this.listQueryParams.next_cursor?.length > 0) {
      this.onScrollGetQuotationList(this.listQueryParams);
    }
  }

  onScrollGetQuotationList(params) {
    this.isLoading = true;
    this._quotationV2Service.getQuotationList(params).subscribe(data => {
      this.quotationList.push(...data['result'].qos);
      params.next_cursor = data['result'].next_cursor;
      this.isLoading = false;
    })
  }

  trackById(item: any): string {
    return item.id;
  }
  // decline(data) {
  //   this._quotationV2Service.postQuotationStatus(data.id, '3').subscribe(resp => {
  //     data['status'] = 3
  //     this._analytics.addEvent(this.analyticsType.UPDATED,this.analyticsScreen.QUOTATION,this.screenType.LIST,"Quotation Declined");
  //   })

  // }

  // accept(data) {
  //   this._quotationV2Service.postQuotationStatus(data.id, '2').subscribe(resp => {
  //     data['status'] = 2
  //     this._analytics.addEvent(this.analyticsType.UPDATED,this.analyticsScreen.QUOTATION,this.screenType.LIST,"Quotation Accepted");
  //   })
  // }

  popupFunction(data) {
    this.quotationLabel = data.extras.find((item) => item.id === 'quotation_no')?.value?.name;
    this.deleteQuotationId = data.id;
    this.popupInputData['show'] = true;
  }

  confirmButton(event) {
    if (event) {
      this.commonloaderservice.getShow();
      this.apiHandler.handleRequest(this._quotationService.deleteQuotation(this.deleteQuotationId),`${this.quotationLabel} deleted successfully!`).subscribe(
        {
          next: () => {
            this._analytics.addEvent(this.analyticsType.DELETED,this.analyticsScreen.QUOTATION,this.screenType.LIST,"Quotation Deleted");
            this.listQueryParams.next_cursor = '';
            this.getQuotationList(this.listQueryParams);
          },
            error: () => {
              this.popupInputData['show'] = false;
            },
        }
      )
    }
    this.popupInputData['show'] = false;
  }

}
