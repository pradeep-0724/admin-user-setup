import { Component, OnDestroy, OnInit } from '@angular/core';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { FuelChallanService } from '../../api-services/fuel-challan-service/fuel-challan.service';
import { ListWidgetData } from '../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2-interface';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import moment from 'moment';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';
import { SetHeightService } from 'src/app/core/services/set-height.service';

@Component({
  selector: 'app-fuel-challan-list',
  templateUrl: './fuel-challan-list.component.html',
  styleUrls: ['./fuel-challan-list.component.scss'],
  host: {
    '(document:click)': 'outSideClick($event)'
  }
})
export class FuelChallanListComponent implements OnInit ,OnDestroy{
  fuelChallanList = [];
  showOptions = '';
  listIndexData = {};
  inputData = {
    show: false,
    isEdit: false,
    data: {}
  }
  currency_type;
  analyticsType = OperationConstants;
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  fuelPermission = Permission.fuel.toString().split(',');
  prefixUrl = getPrefix();
  filterUrl = 'revenue/unpaid_fuel_challan/filters/'
  listQueryParams = {
    next_cursor: '',
    search: '',
    filters: '[]'
  };
  listUrl='/fuel_challan_list';
  apiError = '';
  isLoading = false;
  constructor(private fuelChallanService: FuelChallanService, private currency: CurrencyService, private commonloaderservice: CommonLoaderService,
    private _analytics: AnalyticsService, private _popupBodyScrollService: popupOverflowService,private router: Router, private route: ActivatedRoute,
    private apiHandler: ApiHandlerService,private _setHeight : SetHeightService) { }

  popupInputData = {
    'msg': 'Are you sure, you want to delete?',
    'type': 'warning',
    'show': false
  }


  ngOnInit() {
    this.commonloaderservice.getHide();
    this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.FUELCHALLAN, this.screenType.LIST, "Navigated");
    setTimeout(() => {
      this.currency_type = this.currency.getCurrency();
    }, 1000);
    this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('search')) {        
        this.selectedParamsTripList()
      } else {
        this.listQueryParams.search='';
        this.listQueryParams.filters='[]'
        this.viewInit();
      }
    });
  }


  editFuel(data) {
    this.inputData = {
      data: data,
      show: true,
      isEdit: true
    }
  }

  ngOnDestroy(): void {
    this.commonloaderservice.getShow();
  }


	ngAfterViewChecked(): void {
		this._setHeight.setTableHeight2(['.calc-height'],'challan-list',0)
	}

  viewInit() {
    const container = document.querySelector('.table-wrapper-list');
    this.listQueryParams.next_cursor=''
    this.fuelChallanService.getFuelChallans(this.listQueryParams).subscribe(data => {
      container.scrollTo(0,0)
      this.fuelChallanList = data['result'].ufc;
      this.listQueryParams.next_cursor = data['result'].next_cursor;

    });
  }

  
  selectedParamsTripList() {
    const queryParams = this.route.snapshot.queryParams;
    this.listQueryParams = {
      search: queryParams['search'],
      next_cursor: '',
      filters: queryParams['filter'],
    }
    this.viewInit();
  }
  

  addNew() {
    this._popupBodyScrollService.popupActive();
    this.inputData = {
      data: {},
      show: true,
      isEdit: false
    }
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
    return (this.showOptions = list_index);
  }

  popupFunction(id, index: any = null) {
    this.listIndexData = { 'id': id, 'index': index };
    this.popupInputData['show'] = true;
    this._popupBodyScrollService.popupActive();
  }

  confirmButton(event) {
    if (event) {
      let id = this.listIndexData['id'];
      this.deleteFuelChallan(id)
      this.listIndexData = {};
    }
  }

  deleteFuelChallan(id) {
    this.apiHandler.handleRequest(this.fuelChallanService.deleteFuelChallans(id), 'Fuel Challan deleted successfully!').subscribe(
      {
        next: () => {
          this._analytics.addEvent(this.analyticsType.DELETED, this.analyticsScreen.FUELCHALLAN)
          this.listQueryParams.next_cursor = ''
          this.listQueryParams.search = '';
          this.listQueryParams.filters = '[]';
          this.viewInit();
        },
        error: () => {
          this.popupInputData['show'] = false;
          this.apiError = 'Failed to delete fuel challan!';
          setTimeout(() => (this.apiError = ''), 3000);
        },
      })
  }

  dataFromPopUp(e) {
    this.inputData = {
      show: false,
      isEdit: false,
      data: {}
    }
    if (e) {
      this.listQueryParams.next_cursor=''
      this.listQueryParams.search ='';
      this.listQueryParams.filters='[]';
      this.router.navigate([this.prefixUrl + this.listUrl]);
      this.viewInit();
    }
  }


  onScroll(event) {
    const container = document.querySelector('.table-wrapper-list');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoading && this.listQueryParams.next_cursor?.length > 0) {
      this.onScrollFuelList(this.listQueryParams);
    }
  }


  onScrollFuelList(params) {
    this.isLoading = true;
    this.commonloaderservice.getShow();
    this.fuelChallanService.getFuelChallans(params).subscribe(data => {
      this.fuelChallanList.push(...data['result'].ufc);
      params.next_cursor = data['result'].next_cursor;
      this.commonloaderservice.getHide();
      this.isLoading = false;
    },err=>{
      this.commonloaderservice.getHide();
      this.isLoading = false;
    })
  }

  trackById(item: any): string {
    return item.id;
  }
  listWidgetData(widgetData: ListWidgetData) {
    this.listQueryParams.next_cursor=''
    let queryParams = new Object(
      {
        search: widgetData.searchValue,
        filter: JSON.stringify(widgetData.filterKeyData),
      }
    );
    this.router.navigate([this.prefixUrl + this.listUrl], { queryParams });
  }

  hideDelete(values=[]){
    let show=true;
    values.forEach(item=>{
      if(item.status.label=='Billed'){
        show=false
      }
    });
    return show
  }
  hideEdit(values=[]){
    let show=false;
    values.forEach(item=>{
      if(item.status.label=='Unbilled'){
        show=true
      }
    });
    return show
  }

  changeDtaetoDDMMYYYY(date){
    return moment(date).format('DD-MM-YYYY')
  }
}
