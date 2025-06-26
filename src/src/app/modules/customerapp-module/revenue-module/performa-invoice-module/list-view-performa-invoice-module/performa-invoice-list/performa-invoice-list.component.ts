import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { PrefixUrlService, getPrefix } from 'src/app/core/services/prefixurl.service';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { TabIndexService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/tab-index.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { ButtonData, DropDownType, ListWidgetData } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2-interface';
import { cloneDeep } from 'lodash';
import { PerformaInvoiceServiceService } from '../../../../api-services/revenue-module-service/performa-invoice-service/performa-invoice-service.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';

@Component({
  selector: 'app-performa-invoice-list',
  templateUrl: './performa-invoice-list.component.html',
  styleUrls: ['./performa-invoice-list.component.scss'],
  host: {
    '(document:click)': 'outSideClick($event)',
  }
})
export class PerformaInvoiceListComponent implements OnInit ,AfterViewChecked,OnDestroy {


  invoiceId = new BehaviorSubject('');
  routeToDetail: any;
  defaultDownload: boolean = false;
  showOptions: string = '';
  selectedId = '';
  popupInputData = {
    'msg': 'Are you sure, you want to delete?',
    'type': 'warning',
    'show': false
  };
  goThroughDetais = {
    show: false,
    url: "https://demo.arcade.software/bVgXIdtWl5pGxp8vtSkf?embed%22"
  }
  popupOutputData: any;
  listIndexData = {};
  apiError: String = "";
  currency_type;
  tabSelectionList: Array<DropDownType> = [
    {
      label: "All Proforma Invoice List",
      value: "0",
    },
    {
      label: "Invoiced List",
      value: "1",
    },
    {
      label: "Finalised List",
      value: "2",
    },
    {
      label: "Draft List",
      value: "3",
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
    name: 'Create Proforma Invoice',
    permission: Permission.invoice.toString().split(',')[0],
    url: getPrefix() + '/income/performa-invoice/add'
  };
  listUrl = '/income/performa-invoice/list';
  filterUrl = 'revenue/performa/invoice/filters/';
  end_date = moment(new Date(dateWithTimeZone())).format('YYYY-MM-DD')
  start_date = moment(new Date(dateWithTimeZone())).subtract(30, 'days').format('YYYY-MM-DD');
  invoiceList:any[]=[];
  invoicePermissions = Permission.invoice.toString().split(',');
  preFixUrl = '';
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;

  screenType=ScreenType;
  constructor(
    private _invoiceListService: PerformaInvoiceServiceService,
    private _activatedroute: ActivatedRoute,
    private currency: CurrencyService,
    private _preFixUrl: PrefixUrlService,
    private _popupBodyScrollService:popupOverflowService,
    private _analytics:AnalyticsService,
    private _fileDownload:FileDownLoadAandOpen,
    private _tabIndex:TabIndexService,
    private _router:Router,
    private commonloaderservice:CommonLoaderService
  ) {
  }
  ngOnDestroy(): void {
    this.commonloaderservice.getShow();
  }

  ngOnInit() {
    setTimeout(() => {
      this.commonloaderservice.getHide();
    }, 300);
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.INVOICE,this.screenType.LIST,"Navigated");
    this.preFixUrl = this._preFixUrl.getprefixUrl();
      this.currency_type = this.currency.getCurrency();
      this._activatedroute.queryParamMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has('selectedTab') && !paramMap.has('pdfViewId')) {
          this.routeToDetail = false;
          this.selectedParamsTripList()
        } else if (paramMap.has('pdfViewId') && paramMap.has('selectedTab')) {
          this.selectedParamsTripList()
          this.routeToDetailById(paramMap['params']['pdfViewId']);
        }
        else if (paramMap.has('pdfViewId') && !paramMap.has('selectedTab')) {
          this.listQueryParams = cloneDeep(this.defaultParams)
          this.getTripList(this.listQueryParams);
          this.routeToDetailById(paramMap['params']['pdfViewId']);
        }
        else {
          this.routeToDetail = false;
          this.listQueryParams = cloneDeep(this.defaultParams)
          this.getTripList(this.listQueryParams);
  
        }
      });
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
    const container = document.querySelector('.fuel-list-wrap');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoading && this.listQueryParams.next_cursor?.length > 0) {
      this.onScrollGetTripList(this.listQueryParams);
    }
  }

  onScrollGetTripList(params) {
    this.isLoading = true;
    this._invoiceListService.getInvoiceList(params).subscribe(data => {
      this.invoiceList.push(...data['result'].pi);
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
      const container = document.querySelector('.fuel-list-wrap');
      container.scrollTo(0,0)
      this.invoiceList = data['result'].pi;      
      params.next_cursor = data['result'].next_cursor;
    });
  }

  openListDetailsData(e) {
    this.routeToDetail = !this.routeToDetail;
    let queryParams = new Object(
      {
        selectedTab: this.listQueryParams.status,
        start_date: this.listQueryParams.start_date,
        end_date: this.listQueryParams.end_date,
        search: this.listQueryParams.search,
        filter: this.listQueryParams.filters,
        label : this.listQueryParams.label
      }
    );
    this._router.navigate([getPrefix() + this.listUrl], { queryParams });

  }

  ngAfterViewChecked() {

    this._tabIndex.tabIndexRemove();

  }
  openGothrough(){
    this.goThroughDetais.show=true;
}

  routeToDetailById(id: string, download: boolean = false) {
    this.invoiceId.next(id);
    this.routeToDetail = true;
    this.defaultDownload = download;
    this.selectedId = id;
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
    this._invoiceListService.deleteInvoice(invoice_id).subscribe(
      data => {
        this._analytics.addEvent(this.analyticsType.DELETED,this.analyticsScreen.INVOICE)
        this.getTripList(this.listQueryParams)
      },
      error => {
        this.apiError = error['error']['message'];
        this.popupInputData['show'] = false;
        setTimeout(() => {
          this.apiError = '';
        }, 10000);
      }
    );
  }


  popupFunction(id, index: any = null) {
    this.listIndexData = { 'id': id, 'index': index };
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
      let fileName = 'proforma_invoice_'+ '.' + type;
      this._fileDownload.writeAndOpenFile(resp, fileName).then(data => {
      });
    });
  }
  
  onClickCancel() {
    this.routeToDetail = false;
  }


  createInvoice(id) {
    let queryParams = {
      performaInvoiceId:id,
    };
    this._router.navigate([getPrefix() + '/income/invoice/add'], { queryParams });
  }

}
