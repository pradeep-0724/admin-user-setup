import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { ButtonData, ListWidgetData } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2-interface';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { ZoneService } from 'src/app/modules/customerapp-module/api-services/master-module-services/zone-service/zone.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';

@Component({
  selector: 'app-zone-list',
  templateUrl: './zone-list.component.html',
  styleUrls: ['./zone-list.component.scss'],
  host: {
    '(document:click)': 'outSideClick($event)',
  }
})
export class ZoneListComponent implements OnInit,AfterViewChecked,OnDestroy {
  zoneList: any=[];
  popupInputData = {
    'msg': 'Are you sure, you want to delete?',
    'type': 'warning',
    'show': false
  }
  popupOutputData: any;
  listIndexData = {};
  apiError: String = "";
  prefixUrl = getPrefix();
  listQueryParams={
    search:'',
    next_cursor:'',
  };
  defaultParams = {
    next_cursor: '',
    search: '',
  };
  scrollFlag=false;
  showOptions: string = '';
  listUrl='/onboarding/zone/list'
  buttonData: ButtonData = {
    name: 'Add Zone',
    permission: Permission.zone.toString().split(',')[0],
    url: this.prefixUrl + '/onboarding/zone/add'
  };
  zonePermission =Permission.zone.toString().split(',');
  analyticsType = OperationConstants;
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  zoneName = '';

  constructor(private zoneService: ZoneService,
    private router: Router,
    private route : ActivatedRoute,
    private setHeight:SetHeightService,private _analytics: AnalyticsService,
    private _commonloaderservice: CommonLoaderService,private apiHandler: ApiHandlerService
  ) { }

  ngOnDestroy(): void {
    this._commonloaderservice.getShow();
  }
  ngOnInit() {
    this._commonloaderservice.getHide();
    this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('search')) {
        this.zoneList=[]
        this.selectedParamsTripList()
      } else {
        this.zoneList=[]
        this.listQueryParams = cloneDeep(this.defaultParams)
        this.getZonesList(this.listQueryParams);
      }
    });
  }
  ngAfterViewChecked(): void {
    this.setHeight.setTableHeight2(['.calc-height'],'zone-list',0)
    
  }

  getZonesList(listQueryParams) {
    this.scrollFlag=true;
    this.zoneService.getZoneList(listQueryParams).subscribe((data)=>{
      this.scrollFlag=false;
      this.listQueryParams.next_cursor=data.result.next_cursor;
      this.zoneList = data.result['ref'];
      
    })

  }
  scrollEvent() {
    const container = document.querySelector('#zone-list');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10)&& !this.scrollFlag && this.listQueryParams.next_cursor?.length > 0) {
      this.getZoneListOnScroll(this.listQueryParams)
    }
  }

  getZoneListOnScroll(listQueryParams){
    this.scrollFlag=true;
    this.zoneService.getZoneList(listQueryParams).subscribe((data)=>{
      this.scrollFlag=false;
      this.listQueryParams.next_cursor=data.result.next_cursor;
      this.zoneList = [...this.zoneList,...data.result['ref']];
    })
  }


  outSideClick(env) {
    if ((env.target.className).indexOf('more-icon') == -1)
      this.showOptions = ''
  }

  optionsList(event, list_index) {
    return this.showOptions = list_index;
  }


  deleteZone(zoneId: string) {
    this.apiHandler.handleRequest(this.zoneService.deleteZone(zoneId), ` ${ this.zoneName} deleted successfully!`).subscribe(
      {
        next: (response) => {
          this._analytics.addEvent(this.analyticsType.DELETED, this.analyticsScreen.ZONE)
          this.listQueryParams.next_cursor = '';
          this.zoneList = []
          this.getZonesList(this.listQueryParams)
        },
        error: (error) => {
          this.apiError = error['error']['message'];
          this.popupInputData['show'] = false;
          setTimeout(() => {
            this.apiError = '';
          }, 4000);
        }
      }
    );
  }



  popupFunction(data, index: any = null) {
    this.zoneName = data.name;
    this.listIndexData = { 'id': data.id, 'index': index };
    this.popupInputData['show'] = true;
  }

  confirmButton(event) {
    if (event) {
      let id = this.listIndexData['id'];      
      this.deleteZone(id);
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
    }
    this.getZonesList(this.listQueryParams);
  }

}
