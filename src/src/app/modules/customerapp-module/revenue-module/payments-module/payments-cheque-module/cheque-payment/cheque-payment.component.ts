import { RevenueService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/revenue-service/revenue.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { BehaviorSubject } from 'rxjs';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import moment from 'moment';
import { changeDateToServerFormat, normalDate } from 'src/app/shared-module/utilities/date-utilis';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ListWidgetData } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2-interface';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { SetHeightService } from 'src/app/core/services/set-height.service';

@Component({
  selector: 'app-cheque-payment',
  templateUrl: './cheque-payment.component.html',
  styleUrls: ['./cheque-payment.component.scss'],
  host: {
    '(document:click)': 'outSideClick($event)'
  }
})
export class ChequePaymentComponent implements OnInit , OnDestroy,AfterViewChecked {

  
  chequeConstants= new ValidationConstants().paymentChequeIds;
  invoiceSettlementPermissions = Permission.payments__settlement.toString().split(',');
  paymentData= [];
  currency_type;
  chequeinputData=new BehaviorSubject({
    show:false,
    chequeData:[]
  })

  listIndexData = {};
  showOptions: string = '';
  prefixUrl = getPrefix();
  tabSelectionList: Array<any> = [
      {
        label: "All Cheque Payments",
        value: "0",
      },
      {
        label: "Cancelled Cheques",
        value: "1",
      },
      {
        label: "Cleared Cheques",
        value: "2",
      },
      {
        label: "Uncleared Cheques",
        value: "3",
      },
      {
        label: "Post-Dated Cheques",
        value: "4",
      },
  
    ];
  
   start_date = moment().subtract(30, 'days').format('YYYY-MM-DD');
    end_date = moment().format('YYYY-MM-DD')
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
      start_date: null,
      end_date: null,
      next_cursor: '',
      search: '',
      status: '0',
      filters: '[]',
      label : ''
    }
    listUrl = '/income/payments/cheque_payment';
    filterUrl = 'revenue/payment/cheque/filters/';
    isLoading = false;
  constructor(private _setHeight:SetHeightService,private currency:CurrencyService,private _revenuseService:RevenueService,
    private _activateRoute:ActivatedRoute, private _router:Router,private commonloaderservice : CommonLoaderService) { }

  ngOnDestroy(): void {
    this.commonloaderservice.getShow();
  }
  ngAfterViewChecked(): void {
    this._setHeight.setTableHeight2(['.calc-height'],'cp-table',0)
  }


  ngOnInit() {
    setTimeout(() => {
      this.commonloaderservice.getHide();
    }, 500);
      this.currency_type = this.currency.getCurrency();
    this._activateRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('selectedTab')) {
        this.selectedParamsTripList()
      }
      else {
        this.listQueryParams = cloneDeep(this.defaultParams)
        this.getTripList(this.listQueryParams);

      }
    });
  }


  getTripList(params) {
    this.listQueryParams.next_cursor = '';
    this._revenuseService.getChequePayementDetails(params).subscribe((data) => {
      const container = document.querySelector('.fuel-list-wrap');
      container.scrollTo(0,0)      
      this.paymentData = data['result'].pc;
      params.next_cursor = data['result'].next_cursor;
    });
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
    this._revenuseService.getChequePayementDetails(params).subscribe(data => {
      this.paymentData.push(...data['result'].pc);
      params.next_cursor = data['result'].next_cursor;
      this.isLoading = false;
    })
  }

  optionsList(list_index) {
     this.showOptions = list_index;
  }

  outSideClick(env) {
    if ((env.target.className).indexOf('more-icon') == -1)
      this.showOptions = ''
  }


  popupFunction(id) {
    let chequeStatus= this.paymentData.filter(item=> item.id ==id);
    this.chequeinputData.next({
      show:true,
      chequeData:chequeStatus
    })


  }

  checkStatusId(id){
    if(id== this.chequeConstants.checqueUnCleared || id== this.chequeConstants.chequePostDate){
      return true;
    }else{
      return false;
    }

  }

  checqueEvent(e){
   if(e){
    this.getTripList(this.listQueryParams)
   }
  }

  dateChange(date){
    return normalDate(date)
  }
}
