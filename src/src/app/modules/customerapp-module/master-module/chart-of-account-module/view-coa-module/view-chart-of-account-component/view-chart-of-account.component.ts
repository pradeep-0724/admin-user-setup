import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { OpeningBalanceService } from '../../../../api-services/master-module-services/chart-of-account-service/chart-of-account.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { PrefixUrlService, getPrefix } from 'src/app/core/services/prefixurl.service';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import {  ListWidgetData } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2-interface';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-view-chart-of-account',
  templateUrl: './view-chart-of-account.component.html',
  styleUrls: ['./view-chart-of-account.component.scss'],
  host: {
    '(document:click)': 'outSideClick($event)',
  }
})

export class ListChartOfAccountComponent implements OnInit,OnDestroy ,AfterViewChecked {
  showModal = false;
  showModalAdd=false;
  chartOfAccountList: Array<any> = [];
  showOptions: any = '';
  coaId: any;
  editCoaUrl:string=getPrefix()+'/onboarding/chart-of-account/add';
  editCoaPer=Permission.opening_balance.toString().split(',')[0]
  popupInputData = {
    'msg': 'Are you sure, you want to delete?',
    'type': 'warning',
    'show': false
  }
  popupOutputData: any;
  listIndexData = {};
  apiError: String = "";
  currency_type;
  prefixUrl = '';
  coaPer=Permission.opening_balance.toString().split(',')
  defaultParams = {
    next_cursor: '',
    search:'',
    filters:'[]',
  };
  listQueryParams={
    next_cursor: '',
    search:'',
    filters:'[]',
  }
  filterUrl='revenue/chart_of_account/account/filters/'
  isLoading = false;
  listUrl='/onboarding/chart-of-account/list'

  constructor(private _obService: OpeningBalanceService, private _prefixUrl:PrefixUrlService,private route: ActivatedRoute,private apiHandler: ApiHandlerService,
    private _setHeight:SetHeightService, private currency:CurrencyService,private commonloaderservice:CommonLoaderService,private router: Router, private _popupBodyScrollService:popupOverflowService) { }

  ngOnInit() {
    this.commonloaderservice.getHide();
    this.prefixUrl = this._prefixUrl.getprefixUrl();
     setTimeout(() => {
      this.currency_type = this.currency.getCurrency();
    }, 1000);
     this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('selectedTab')){
        this.selectedParamsAccountList()  
      }else{
        this.listQueryParams = cloneDeep(this.defaultParams)
        this.getObAccounts(this.listQueryParams);
      }
    });
  }
  ngAfterViewChecked(): void {
   
    this._setHeight.setTableHeight2(['.calc-height'],'chart-of-account-list',0)
 
}

  selectedParamsAccountList(){
    const queryParams = this.route.snapshot.queryParams;
      this.listQueryParams={
      search:queryParams['search'],
      next_cursor:'',
      filters:queryParams['filter']

    }
    this.getObAccounts(this.listQueryParams);
   }

  getObAccounts(params) {
    this._obService.getOpeningBalanceAccountList(params).subscribe((response: any) => {
      this.chartOfAccountList = response.result.acc;
      params.next_cursor=response['result'].next_cursor;
    });
  }

  popupOverflowActive(){
    this._popupBodyScrollService.popupActive()
   }
    


  outSideClick(env) {
    if ((env.target.className).indexOf('more-icon') == -1)
      this.showOptions = ''
  }
  optionsList(event, list_index) {
    return this.showOptions = list_index;
  }
  editChartOfAccount(coaId) {
    this.coaId = coaId;
    this.showModal = true;
  }

  deleteChartOfAccount(coaId) {
    this.commonloaderservice.getShow();
    this.apiHandler.handleRequest(this._obService.deleteCoaAccount(coaId), 'COA deleted successfully!').subscribe(
      {
        next: () => {
          this.listQueryParams.next_cursor = ''
          this.commonloaderservice.getHide();
          this.getObAccounts(this.listQueryParams);
        },
        error: (error) => {
          this.apiError = error['error']['message'];
          this.popupInputData['show'] = false;
          this.commonloaderservice.getHide();
          setTimeout(() => {
            this.apiError = '';
          }, 10000);
        }
      }
    );
  }

  refresh($event) {
    if ($event)
    this.listQueryParams.next_cursor =''
    this.getObAccounts(this.listQueryParams);
  }

  onScroll(event) {
    const container = document.querySelector('#chart-of-account-list');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10)&& !this.isLoading && this.listQueryParams.next_cursor?.length > 0) {
       this.onScrollGetAccountList(this.listQueryParams);
    }
  }

  onScrollGetAccountList(params){
    this.isLoading = true;
    this._obService.getOpeningBalanceAccountList(params).subscribe(data=>{
      this.chartOfAccountList.push(...data['result'].acc);
      params.next_cursor = data['result'].next_cursor;
      this.isLoading = false;
    })
  }


  popupFunction(id, index: any = null) {
    this.listIndexData = { 'id': id, 'index': index };
    this.popupInputData['show'] = true;
  }

  confirmButton(event) {
    if (event) {
      let id = this.listIndexData['id'];
      this.deleteChartOfAccount(id);
      this.listIndexData = {};
    }
  }

  generateURL(id){
		return this.prefixUrl+'/onboarding/chart-of-account/transaction/'+id;
	}

  listWidgetData(widgetData: ListWidgetData){
    let  queryParams = new Object(
      {
        search:widgetData.searchValue,
        filter:JSON.stringify(widgetData.filterKeyData),
        selectedTab:'',
      }
    );
    this.router.navigate([getPrefix()+this.listUrl], { queryParams });
  }

  ngOnDestroy(): void {
    this.commonloaderservice.getShow();
  }

}
