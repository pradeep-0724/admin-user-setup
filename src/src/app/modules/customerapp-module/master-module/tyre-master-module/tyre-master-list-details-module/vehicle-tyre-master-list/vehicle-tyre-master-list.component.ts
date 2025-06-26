import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { getPrefix, PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { ButtonData, ListWidgetData } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2-interface';
import { cloneDeep } from 'lodash';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { TyremasterListService } from '../../../../api-services/master-module-services/tyre-master-service/tyremaster-list-service.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-vehicle-tyre-master-list',
  templateUrl: './vehicle-tyre-master-list.component.html',
  styleUrls: ['./vehicle-tyre-master-list.component.scss'],
  host: {
		'(document:click)': 'outSideClick($event)',
	}
})
export class VehicleTyreMasterListComponent implements OnInit, OnDestroy {
  tyreMasterData: any=[];
  popupInputData = {
		'msg': 'Are you sure, you want to delete?',
		'type': 'warning',
		'show': false
  }
  listIndexData = {};
  showOptions: any='';
  apiError: any='';
  prefixUrl = '';
  filterUrl='vehicle/tyre/master/filters/'
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;
  screenType=ScreenType;
  tyreMaster=Permission.tyre_master.toString().split(',')
  buttonData: ButtonData = {
		name: 'Add Tyre Master',
		permission: Permission.tyre_master.toString().split(',')[0],
		url: getPrefix() + '/onboarding/vehicle/tyremaster/add'
	};

  listUrl='/onboarding/vehicle/tyremaster/view'
  tyreLayout={
    open:false,
    data:{}
  }

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
  isLoading=false;

  constructor( private _prefixUrl : PrefixUrlService,private _analytics:AnalyticsService,  private route : ActivatedRoute,private _commonloaderservice: CommonLoaderService,
    private _tyremasterListService :TyremasterListService,private _router:Router,private _setHeight:SetHeightService,private apiHandler: ApiHandlerService) { }

  ngOnInit() {
    this._commonloaderservice.getHide();
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.TYREMASTER,this.screenType.LIST,"Navigated");
    this.prefixUrl = this._prefixUrl.getprefixUrl();
    this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('search')) {
        this.tyreMasterData=[]
        this.selectedParamsList()
      } else {
        this.tyreMasterData=[]
        this.listQueryParams = cloneDeep(this.defaultParams)
        this.getTyreMasterList(this.listQueryParams);
      }
    });
  }
  ngAfterViewChecked(): void {
    
      this._setHeight.setTableHeight2(['.calc-height'],'tyre-master-list',0)
    
  }

  ngOnDestroy(): void {
    this._commonloaderservice.getShow();
  }
  getTyreMasterList(listQueryParams){
    this.isLoading=true;
    this._tyremasterListService.getAllTyreMasters(listQueryParams).subscribe((response)=>{
      this.isLoading=false;
      this.listQueryParams.next_cursor=response['result'].next_cursor;
      this.tyreMasterData =  [...this.tyreMasterData,...response['result']['vtm_list']] ;
    })
  }

  

  popupFunction(id, index: any = null) {
    this.listIndexData = { 'id': id, 'index': index };
    this.popupInputData['show'] = true;
  }

  confirmButton(event) {
    if (event) {
      let id = this.listIndexData['id'];
      this.deleteRecord(id);
      this.listIndexData = {};
    }

  }

  scrollEvent() {
    const container = document.querySelector('#tyre-master-list');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10)&& !this.isLoading && this.listQueryParams.next_cursor?.length > 0) {
      this.getTyreMasterList(this.listQueryParams)
    }
  }

  deleteRecord(id) {
    this.apiHandler.handleRequest(this._tyremasterListService.deleteTyreMaster(id),'Tyre master deleted successfully!').subscribe(
      {
        next: () => {
          this._analytics.addEvent(this.analyticsType.DELETED, this.analyticsScreen.TYREMASTER)
          this.listQueryParams.next_cursor = '';
          this.tyreMasterData = [];
          this.getTyreMasterList(this.listQueryParams);
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

  optionsList(event, list_index) {
    return this.showOptions = list_index;
  }


  outSideClick(env) {
    if ((env.target.className).indexOf('more-icon') == -1)
      this.showOptions = ''
  }

  openLayout(data){
   this.tyreLayout.open=true;
   this.tyreLayout.data=data
  }

  listWidgetData(widgetData: ListWidgetData) {
		let queryParams = new Object(
			{
				selectedTab: widgetData.tabSelection,
				search: widgetData.searchValue,
				filter: JSON.stringify(widgetData.filterKeyData)
			}
		);
		this._router.navigate([getPrefix() + this.listUrl], { queryParams });
	}

  selectedParamsList() {
    const queryParams = this.route.snapshot.queryParams;
    this.listQueryParams = {
      search: queryParams['search'],
      next_cursor: '',
      filters: queryParams['filter'],
    }
    this.getTyreMasterList(this.listQueryParams);
  }


}


