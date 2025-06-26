import { Component, OnInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { InvoiceService } from '../../../../api-services/revenue-module-service/invoice-service/invoice.service';
import { changeDateToServerFormat, normalDate } from 'src/app/shared-module/utilities/date-utilis';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { getPrefix, PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import moment from 'moment';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { TabIndexService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/tab-index.service';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { ButtonData, DropDownType, ListWidgetData } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2-interface';
import { cloneDeep } from 'lodash';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';



@Component({
  selector: 'app-list-invoice',
  templateUrl: './list-invoice.component.html',
  styleUrls: ['./list-invoice.component.scss'],
  host: {
    '(document:click)': 'outSideClick($event)',
  }
})
export class ListInvoiceComponent implements OnInit,AfterViewChecked,OnDestroy {

  isLiveStatusOpen:Boolean=false;
  invoiceId = new BehaviorSubject('');
  showOptions: string = '';
  selectedId = '';
  tabSelectionList: Array<DropDownType> = [
    {
      label: "All Invoice List",
      value: "0",
    },
    {
      label: "Finalised List",
      value: "1",
    },
    {
      label: "Partially Paid List",
      value: "2",
    },
    {
      label: "Paid List",
      value: "3",
    },
    {
      label: "Draft List",
      value: "4",
    },
  ];

  defaultParams = {
    start_date: null,
    end_date: null,
    next_cursor: '',
    search: '',
    status: '0',
    filters: '[]',
    label : ''
  };
  listQueryParams = {
    start_date: '',
    end_date: '',
    next_cursor: '',
    search: '',
    status: '',
    filters: '[]',
    label : ''
  }
  selectedTripId: string = '';
  isLoading = false;
  buttonData: ButtonData = {
    name: 'Add Invoice',
    permission: Permission.invoice.toString().split(',')[0],
    url: getPrefix() + '/income/invoice/add'
  };
  popupInputData = {
    'msg': 'Are you sure, you want to delete?',
    'type': 'warning',
    'show': false
  };
  listUrl = '/income/invoice/list';
  filterUrl = 'revenue/invoice/filters/';
  end_date = moment(new Date(dateWithTimeZone())).format('YYYY-MM-DD')
  start_date = moment(new Date(dateWithTimeZone())).subtract(30, 'days').format('YYYY-MM-DD');
  invoiceList=[];
  goThroughDetais = {
    show: false,
    url: "https://demo.arcade.software/bVgXIdtWl5pGxp8vtSkf?embed%22"
  }
  popupOutputData: any;
  listIndexData = {};
  apiError: String = "";
  currency_type;

  invoicePermissions = Permission.invoice.toString().split(',');
  isFilterApplied = false;
  preFixUrl = '';
  selectedRange: Date[];
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;
  screenType=ScreenType;
  liveStatus:any;
  invoiceNumber = '';

  constructor(
    private _invoiceListService: InvoiceService,
    private _activatedroute: ActivatedRoute,
    private currency: CurrencyService,
    private _preFixUrl: PrefixUrlService,
    private _popupBodyScrollService:popupOverflowService,
    private _analytics:AnalyticsService,
    private _fileDownload:FileDownLoadAandOpen,
    private _tabIndex:TabIndexService,
    private _router:Router,
    private commonloaderservice: CommonLoaderService,
    private setHeight:SetHeightService,
    private apiHandler: ApiHandlerService,
  ) {
  }
  ngOnDestroy(): void {
    this.commonloaderservice.getShow()
  }

  ngOnInit() {
    setTimeout(() => {
      this.commonloaderservice.getHide()
    }, 700);
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.INVOICE,this.screenType.LIST,"Navigated");
    this.preFixUrl = this._preFixUrl.getprefixUrl();
    this.currency_type = this.currency.getCurrency();
      this._activatedroute.queryParamMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has('selectedTab')) {
          this.selectedParamsTripList()
        }
        else {
          this.listQueryParams = cloneDeep(this.defaultParams)
          this.getTripList(this.listQueryParams);
  
        }
      });
      this.getJobCardLiveStatus()
  }

  selectedParamsTripList() {
    const queryParams = this._activatedroute.snapshot.queryParams;
    this.listQueryParams = {
      start_date: changeDateToServerFormat(queryParams['start_date']),
      end_date: changeDateToServerFormat(queryParams['end_date']),
      search: queryParams['search'],
      status: queryParams['selectedTab'],
      next_cursor: '',
      filters: queryParams['filter'],
      label : queryParams['label'],

    }
    this.getTripList(this.listQueryParams);
  }
  getJobCardLiveStatus(){
    this._invoiceListService.getInvoiceLiveStatus().subscribe((data) => {
     this.liveStatus=data['result'];
     
    })
  }
  listWidgetData(widgetData: ListWidgetData) {
    let queryParams = new Object(
      {
        selectedTab: widgetData.tabSelection,
        start_date: widgetData.dateRange.startDate,
        end_date: widgetData.dateRange.endDate,
        search: widgetData.searchValue,
        filter: JSON.stringify(widgetData.filterKeyData),
        label : widgetData.dateRange.selectedOpt
      }
    );
    this._router.navigate([getPrefix() + this.listUrl], { queryParams });
  }

  onScroll(event) {
    const container = document.querySelector('#invoice-list');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoading && this.listQueryParams.next_cursor?.length > 0) {      
      this.onScrollGetTripList(this.listQueryParams);
    }
  }

  onScrollGetTripList(params) {
    this.isLoading = true;
    this._invoiceListService.getInvoiceList(params).subscribe(data => {
      this.invoiceList.push(...data['result'].in);
      params.next_cursor = data['result'].next_cursor;
      this.isLoading = false;
    })
  }

 createQueryParems(id) {
    let queryParams = new Object(
      {
        selectedTab: this.listQueryParams.status,
        start_date: this.listQueryParams.start_date,
        end_date: this.listQueryParams.end_date,
        search: this.listQueryParams.search,
        filter: this.listQueryParams.filters,
        pdfViewId: id,
        label : this.listQueryParams.label
      }
    );
    this._router.navigate([getPrefix() + this.listUrl], { queryParams });
  }
 getTripList(params) {
    this.listQueryParams.next_cursor = '';
    this._invoiceListService.getInvoiceList(params).subscribe((data) => {
      const container = document.querySelector('#invoice-list');
      container.scrollTo(0,0)
      this.invoiceList = data['result'].in;      
      params.next_cursor = data['result'].next_cursor;
    });
  }
  ngAfterViewChecked() {

    this._tabIndex.tabIndexRemove();
        this.setHeight.setTableHeight2(['.calc-height'],'invoice-list',0);

  }
  openGothrough(){
    this.goThroughDetais.show=true;
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
  optionsList(event, list_index) {
    return this.showOptions = list_index;
  }


  deleteInvoice(invoice_id) {
  this.apiHandler.handleRequest(this._invoiceListService.deleteInvoice(invoice_id), `${this.invoiceNumber} deleted successfully!`).subscribe(
      {
        next: data => {
          this._analytics.addEvent(this.analyticsType.DELETED, this.analyticsScreen.INVOICE)
          this.getTripList(this.listQueryParams);
          this.getJobCardLiveStatus()
        },
        error: error => {
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
    this.invoiceNumber = data.invoice_number
    this.listIndexData = { 'id': data.id, 'index': index };
    this.popupInputData['show'] = true;
    this._popupBodyScrollService.popupActive();
  }

  confirmButton(event) {
    if (event) {
      let id = this.listIndexData['id'];
      this.deleteInvoice(id);
      this.listIndexData = {};
    }
  }

  exportList(event) {
    let params = cloneDeep(this.listQueryParams)
    params['export'] = true
    delete params['next_cursor']
    this._invoiceListService.getInvoiceExport(params).subscribe(resp => {
      let type = 'xlsx';
      let fileName = 'invoice_'+ '.' + type;
      this._fileDownload.writeAndOpenFile(resp, fileName).then(data => {
      });
    });
  }

dateChange(date){
  return normalDate(date)
}


}
