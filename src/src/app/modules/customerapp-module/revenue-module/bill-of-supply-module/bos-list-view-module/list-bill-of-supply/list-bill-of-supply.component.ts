import {  BehaviorSubject } from 'rxjs';
import { BillOfSupplyService } from '../../../../api-services/revenue-module-service/bos-service/bill-of-supply.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { changeDateToServerFormat, normalDate } from 'src/app/shared-module/utilities/date-utilis';
import moment from 'moment';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ListWidgetData } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2-interface';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';


@Component({
  selector: 'app-list-bill-of-supply',
  templateUrl: './list-bill-of-supply.component.html',
  styleUrls: ['./list-bill-of-supply.component.scss'],
  host: {
    '(document:click)': 'outSideClick($event)',
  }
})
export class ListBillOfSupplyComponent implements OnInit , OnDestroy{
 
  routeToDetail: any;
  defaultDownload: boolean = false;
  showOptions: String = '';
  billofsupply_id = new BehaviorSubject('');
  popupInputData = {
    'msg': 'Are you sure, you want to delete?',
    'type': 'warning',
    'show': false
  }
  popupOutputData: any;
  listIndexData = {};
  apiError: String = "";
  bosPermission = Permission.bos.toString().split(',');
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;
  screenType=ScreenType;
  prefixUrl = getPrefix();
  tabSelectionList: Array<any> = [
      {
        label: "All BOS List",
        value: "4",
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
        value: "0",
      },
  
    ];
    buttonData: any = {
      name: 'Add BOS',
      permission: Permission.bos.toString().split(',')[0],
      url: this.prefixUrl + '/income/billofsupply/add'
    };
  
    start_date = moment().subtract(30, 'days').format('YYYY-MM-DD');
    end_date = moment().format('YYYY-MM-DD')
    defaultParams = {
      start_date: null,
      end_date: null,
      next_cursor: '',
      search: '',
      status: '4',
      filters: '[]',
      label :''
    };
    listQueryParams = {
      start_date: this.start_date,
      end_date: this.end_date,
      next_cursor: '',
      search: '',
      status: '4',
      filters: '[]',
      label :''
    }
    listUrl = '/income/billofsupply/list';
    filterUrl = 'revenue/bos/filters/';
    isLoading = false;
    billOfSupllyList=[];
    currency_type;
    selectedId = '';
  bosNumber = '';

  constructor(
    private _billOfSupplyService: BillOfSupplyService,
    private _analytics:AnalyticsService,
    private _fileDownload:FileDownLoadAandOpen,private apiHandler: ApiHandlerService,
    private _popupBodyScrollService:popupOverflowService,private _activateRoute :ActivatedRoute,
    private _router:Router, private currency: CurrencyService,private commonloaderservice :CommonLoaderService) { }

  ngOnInit() {
    setTimeout(() => {
      this.commonloaderservice.getHide()
    }, 400);
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.BOS,this.screenType.LIST,"Navigated");
    this.currency_type = this.currency.getCurrency();
    this._activateRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
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

  getTripList(params) {
    this.listQueryParams.next_cursor = '';
    this._billOfSupplyService.getBillOfSupply(params).subscribe((data) => {
      const container = document.querySelector('.fuel-list-wrap');
      container.scrollTo(0,0);
      this.billOfSupllyList = data['result'].bos;
      params.next_cursor = data['result'].next_cursor;
    });
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

  selectedParamsTripList() {
    const queryParams = this._activateRoute.snapshot.queryParams;
    this.listQueryParams = {
      start_date: changeDateToServerFormat(queryParams['start_date']),
      end_date: changeDateToServerFormat(queryParams['end_date']),
      search: queryParams['search'],
      status: queryParams['selectedTab'],
      next_cursor: '',
      filters: queryParams['filter'],
      label: queryParams['label']

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
    this._billOfSupplyService.getBillOfSupply(params).subscribe(data => {
      this.billOfSupllyList.push(...data['result'].bos);
      params.next_cursor = data['result'].next_cursor;
      this.isLoading = false;
    })
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
  optionsList(list_index) {
     this.showOptions = list_index;
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
  
  dateChange(date) {
    return normalDate(date);
  }

  routeToDetailById(id: string, download: boolean = false) {
    this.billofsupply_id.next(id);
    this.routeToDetail = true;
    this.selectedId = id;
    this.defaultDownload = download;
  }


  deleteBoS(id) {
    this.apiHandler.handleRequest(this._billOfSupplyService.deleteBoS(id), ` ${this.bosNumber} deleted successfully!`).subscribe(
      {
        next: data => {
          this._analytics.addEvent(this.analyticsType.DELETED, this.analyticsScreen.BOS)
          this.getTripList(this.listQueryParams)
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

  ngOnDestroy(): void {
    this.commonloaderservice.getShow()
    
  }

  popupFunction(data, index: any = null) {
    this.bosNumber = data.bos_number;
    this.listIndexData = { 'id': data.id, 'index': index };
    this.popupInputData['show'] = true;
    this._popupBodyScrollService.popupActive();
  }

  confirmButton(event) {
    if (event) {
      let id = this.listIndexData['id'];
      this.deleteBoS(id);
      this.listIndexData = {};
    }
  }

  exportList(e) {
    this._billOfSupplyService.getBillOfSupplyExport(this.listQueryParams.start_date, this.listQueryParams.end_date).subscribe(resp => {
      let type = 'xlsx';
      let date = this.start_date + "_" + this.end_date;
      let fileName = 'bos_' + date + '.' + type;
      this._fileDownload.writeAndOpenFile(resp, fileName).then(data => {
      });
    })
  }
  onClickCancel() {
    this.routeToDetail = false;
  }


}
