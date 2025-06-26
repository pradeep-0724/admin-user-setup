import { CreditService } from '../../../../api-services/revenue-module-service/credit-note-service/credit-note.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import moment from 'moment';
import { cloneDeep } from 'lodash';
import { ListWidgetData } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2-interface';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';


@Component({
  selector: 'app-list-credit-note',
  templateUrl: './list-credit-note.component.html',
  styleUrls: ['./list-credit-note.component.scss'],
  host: {
    '(document:click)': 'outSideClick($event)',
  }
})
export class ListCreditNoteComponent implements OnInit ,OnDestroy{

  routeToDetail: boolean = false;
  creditNoteId = new BehaviorSubject('');
  defaultDownload: boolean = false;
  creditStatus: any = {};
  showOptions: string = '';
  popupInputData = {
    'msg': 'Are you sure, you want to delete?',
    'type': 'warning',
    'show': false
  }
  popupOutputData: any;
  listIndexData = {};
  apiError: String = "";
  search: any;
  currency_type;
  selectedId='';
  creditNotePermissions = Permission.credit_note.toString().split(',');
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;
  screenType=ScreenType;

  goThroughDetais = {
    show: false,
    url: "https://demo.arcade.software/wWZOqOd9TcPnZDEOarlz?embed%22"
  }
  
 start_date = moment().subtract(30, 'days').format('YYYY-MM-DD');
 end_date = moment().format('YYYY-MM-DD')
 defaultParams = {
   start_date: null,
   end_date: null,
   next_cursor: '',
   search: '',
   status: '3',
   filters: '[]',
   label :''
 };
 listQueryParams = {
   start_date: this.start_date,
   end_date: this.end_date,
   next_cursor: '',
   search: '',
   status: '3',
   filters: '[]',
   label :''
 }
 listUrl = '/income/credit-note/list';
 filterUrl = 'revenue/credit_note/filters/';
 isLoading = false;
 tabSelectionList: Array<any> = [
   {
     label: "All Credit Note List",
     value: "3",
   },
   {
     label: "Finalised List",
     value: "1",
   },
   {
     label: "Draft List",
     value: "0",
   },
   {
    label: "Closed List",
    value: "2",
  },

 ];
 prefixUrl=getPrefix();
buttonData: any = {
   name: 'Add Credit Note',
   permission: Permission.credit_note.toString().split(',')[0],
   url: this.prefixUrl + '/income/credit-note/add'
 };
 creditNoteList=[];
 creditNoteNumber = '';

  constructor(
    private _creditNoteService: CreditService,
    private _activatedroute: ActivatedRoute,
    private currency:CurrencyService,
    private _analytics:AnalyticsService,
    private _router:Router,
    private _popupBodyScrollService:popupOverflowService,
    private commonloaderservice :CommonLoaderService,
    private _setHeight:SetHeightService,
    private apiHandler: ApiHandlerService
  ) {
  }
  ngAfterViewChecked(): void {
    this._setHeight.setTableHeight2(['.calc-height'],'credit-note',0)
  }

  ngOnDestroy(): void {
    this.commonloaderservice.getShow()
  }
  ngOnInit() {
    setTimeout(() => {
      this.commonloaderservice.getHide();
    }, 400);
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.CREDITNOTE,this.screenType.LIST,"Navigated");
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

  getTripList(params) {
    this.listQueryParams.next_cursor = '';
    this._creditNoteService.getCreditNoteList(params).subscribe((data) => {
    const container = document.querySelector('.fuel-list-wrap');
    container.scrollTo(0,0)
      this.creditNoteList = data['result'].cn;      
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
    const queryParams = this._activatedroute.snapshot.queryParams;
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
    this._creditNoteService.getCreditNoteList(params).subscribe(data => {
      this.creditNoteList.push(...data['result'].cn);
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



  openGothrough(){
    this.goThroughDetais.show=true;
}
  outSideClick(env) {
    try {
      if ((env.target.className).indexOf('more-icon') == -1){
        this.showOptions = ''
      }
    } catch (error) {
      console.log(error)
    }
  }
  optionsList(list_index) {    
     this.showOptions = list_index;

  }

  routeToDetailById(id: string, download: boolean = false) {
    this.creditNoteId.next(id);
    this.routeToDetail = true;
    this.defaultDownload = download;
    this.selectedId =id;
  }  


  deleteCreditNote(credit_note_id) {
    this.apiHandler.handleRequest(this._creditNoteService.deleteCreditNote(credit_note_id),` ${ this.creditNoteNumber} deleted successfully!`).subscribe(
      {
        next: () => {
        this._analytics.addEvent(this.analyticsType.DELETED,this.analyticsScreen.CREDITNOTE)
        this.getTripList(this.listQueryParams)
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
    this.creditNoteNumber = data.credit_note_number;
    this.listIndexData = { 'id': data.id, 'index': index };
    this.popupInputData['show'] = true;
    this._popupBodyScrollService.popupActive()
  }

  confirmButton(event) {
    if (event) {
      let id = this.listIndexData['id'];
      this.deleteCreditNote(id);
      this.listIndexData = {};
    }
  }

  onClickCancel(){
    this.routeToDetail = false;
  }

}
