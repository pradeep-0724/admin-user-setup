import { TaxService } from '../../../../../../core/services/tax.service';
import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { BankService } from '../../../../api-services/master-module-services/bank-service/bank.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { ButtonData, ListWidgetData } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2-interface';
import { cloneDeep } from 'lodash';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-bank-list',
  templateUrl: './bank-list.component.html',
  styleUrls: [
    './bank-list.component.scss'
  ],
  host: {
    '(document:click)': 'outSideClick($event)',
  }
})
export class BankListComponent implements OnInit ,OnDestroy ,AfterViewChecked{
  videoUrl ="https://ts-pub-directory.s3.ap-south-1.amazonaws.com/Bank+n+Chart+of+Accounts.mp4"
  bankListDetail: any=[];
  allData: any = [];
  p: number = 1;
  search='';
  filter_by: number = 5;
  filter = new ValidationConstants().filter;
  showOptions: string = '';
  showFilter: boolean = false;
  bankPre=Permission.bank.toString().split(',')
  options: any = {
    columns: [
      {
        title: 'Bank',
        key: 'bank_name.label',
        type: 'unique'
      },
      {
        title: 'IFSC',
        key: 'ifsc_code',
        type: 'unique'
      }
    ]
  };
  filterUrl="company/bank/filter/" ;
  popupInputData = {
    'msg': 'Are you sure, you want to deactivate?',
    'type': 'warning',
    'show': false
  }
  popupOutputData: any;
  listIndexData = {};
  apiError: String = "";
  isFilterApplied =false;
  prefixUrl = getPrefix();
  isTax = false;
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;
  screenType=ScreenType;

  isTDS=false;
  listQueryParams={
    search:'',
    next_cursor:'',
    filters:'',
  };
  defaultParams = {
    next_cursor: '',
    search: '',
    filters: '',
  };
  scrollFlag=false;
  goThroughDetais = {
    show: false,
    url: "https://demo.arcade.software/lsS6oKXpKBJhCkdRruWW?embed%22"
  };
  currency_type;

  listUrl='/onboarding/bank/list'
  buttonData: ButtonData = {
    name: 'Add Bank',
    permission: Permission.bank.toString().split(',')[0],
    url: this.prefixUrl + '/onboarding/bank/add'
  };
  bankname = '';

  constructor(private _bankService: BankService,
    private _router: Router,
    private _isTax:TaxService,
    private _analytics:AnalyticsService,
    private currency: CurrencyService,
    private router: Router,
    private route : ActivatedRoute,
    private _commonloaderservice: CommonLoaderService,
    private _setHeight:SetHeightService,
    private apiHandler: ApiHandlerService,
  ) { }

  ngOnDestroy(): void {
    this._commonloaderservice.getShow()
  }
  ngAfterViewChecked(): void {
   
      this._setHeight.setTableHeight2(['.calc-height'],'bank-list',0)
   
  }
  ngOnInit() {
    this._commonloaderservice.getHide()
    this.currency_type = this.currency.getCurrency();
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.BANK,this.screenType.LIST,"Navigated");
    this.isTax = this._isTax.getTax();
    this.isTDS = this._isTax.getVat();
    this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('search')) {
        this.bankListDetail=[]
        this.selectedParamsTripList()
      } else {
        this.bankListDetail=[]
        this.listQueryParams = cloneDeep(this.defaultParams)
        this.getAllBankList(this.listQueryParams);
      }
    });
  }
  getAllBankList(listQueryParams) {
    this.scrollFlag=true;
    this._bankService.getBankListDetails(listQueryParams).subscribe((data)=>{
      this.scrollFlag=false;
      this.listQueryParams.next_cursor=data.result.next_cursor;
      this.bankListDetail = [...this.bankListDetail,...data.result['banks']];
      
    })

  }
  scrollEvent() {
    const container = document.querySelector('#bank-list');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10)&& !this.scrollFlag && this.listQueryParams.next_cursor?.length > 0) {
      this.getAllBankList(this.listQueryParams)
    }
  }


  defaultBankChecked(id){
    this._bankService.makeDefaultBankAccount(id).subscribe((data)=>{      
    })
  }



  outSideClick(env) {
    if ((env.target.className).indexOf('more-icon') == -1)
      this.showOptions = ''
  }

  optionsList(event, list_index) {
    return this.showOptions = list_index;
  }
  routeToEdit(bank_id) {
    this._router.navigate([this.prefixUrl+'/onboarding/bank/edit/' + bank_id]);
  }

  deleteBank(bankId: string) {
    this.apiHandler.handleRequest (this._bankService.deleteBank(bankId), ` ${this.bankname} deactivated successfully!`).subscribe(
      {
        next: () => {
          this._analytics.addEvent(this.analyticsType.DELETED, this.analyticsScreen.BANK)
          this.listQueryParams.next_cursor = '';
          this.bankListDetail = []
          this.getAllBankList(this.listQueryParams)
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


  openGothrough(){    
    this.goThroughDetais.show=true;
}

  popupFunction(bank, index: any = null) {
    this.bankname = bank.display_name;
    this.listIndexData = { 'id': bank.id, 'index': index };
    this.popupInputData['show'] = true;
  }

  confirmButton(event) {
    if (event) {
      let id = this.listIndexData['id'];      
      this.deleteBank(id);
      this.listIndexData = {};
    }
  }
  listWidgetData(widgetData: ListWidgetData) {    
    let queryParams = new Object(
      {
        search: widgetData.searchValue,
        filter: JSON.stringify(widgetData.filterKeyData),
      }
    );
    this.router.navigate([getPrefix() + this.listUrl], { queryParams });
  }
  selectedParamsTripList() {
    const queryParams = this.route.snapshot.queryParams;
    this.listQueryParams = {
      search: queryParams['search'],
      next_cursor: '',
      filters: queryParams['filter'],
    }
    this.getAllBankList(this.listQueryParams);
  }

}
