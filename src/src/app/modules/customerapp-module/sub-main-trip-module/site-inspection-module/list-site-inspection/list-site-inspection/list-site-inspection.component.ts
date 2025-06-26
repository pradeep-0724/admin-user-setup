import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ScreenConstants, ScreenType, OperationConstants } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import {  ButtonData, ListWidgetData } from '../../../new-trip-v2/list-module-v2/list-module-v2-interface';
import { SiteInspectionServiceService } from '../../../../api-services/trip-module-services/site-inspection-service/site-inspection-service.service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-list-site-inspection',
  templateUrl: './list-site-inspection.component.html',
  styleUrls: ['./list-site-inspection.component.scss']
})
export class ListSiteInspectionComponent implements OnInit  ,OnDestroy,AfterViewChecked{
  filterUrl = 'revenue/site_inspection/filter/'
  listUrl = '/trip/site-inspection/list'
  settingsUrl='revenue/site_inspection/setting/'
  defaultParams = {
    start_date: null,
    end_date:null,
    next_cursor: '',
    search: '',
    status: '0',
    filters: [],
    label :''
  };
  listQueryParams = {
    start_date: '',
    end_date: '',
    next_cursor: '',
    status: '0',
    search: '',
    filters: [],
    label :''
  }
  siteInspectionList = [];
  siteInspectionHeaders=[];
  isLoading = false;
  deleteSiteInspection;
  popupInputData = {
    'msg': 'Are you sure, you want to delete?',
    'type': 'warning',
    'show': false
  }
  siteInspection=Permission.siteInspection.toString().split(',')
  prefixUrl = getPrefix();
  buttonData: ButtonData = {
    name: 'Add Site Inspection',
    permission:this.siteInspection[0],
    url: this.prefixUrl + '/trip/site-inspection/add'
  }
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  analyticsType = OperationConstants;
  siteInspectionName = '';
  constructor(private _analytics: AnalyticsService, private commonloaderservice: CommonLoaderService, private router: Router, private route: ActivatedRoute, 	private apiHandler: ApiHandlerService,
    private _siteInspectionService: SiteInspectionServiceService,private _setHeight:SetHeightService,private _commonloaderservice:CommonLoaderService,private _fileDownload:FileDownLoadAandOpen) { }

  ngOnInit(): void {
    setTimeout(() => {
    this.commonloaderservice.getHide();
    }, 400);
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.SITEINSPECTION,this.screenType.LIST,"Navigated");
    this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('selectedTab')) {
        this.selectedParamsTripList()
      } else {
        this.listQueryParams = cloneDeep(this.defaultParams)
        this.getSiteInspectionList(this.listQueryParams);
      }
    });
  }
  ngAfterViewChecked(): void {
    this._setHeight.setTableHeight2(['.calc-height'],"quotation-list",0)
  }

  listWidgetData(widgetData: ListWidgetData) {    
    let queryParams = new Object(
      {
        start_date: widgetData.dateRange.startDate,
        end_date: widgetData.dateRange.endDate,
        search: widgetData.searchValue,
        filter: JSON.stringify(widgetData.filterKeyData),
        selectedTab: widgetData.tabSelection,
        label : widgetData.dateRange.selectedOpt
      }
    );
    this.router.navigate([getPrefix() + this.listUrl], { queryParams });
  }


  ngOnDestroy(): void {
    this.commonloaderservice.getShow();
  }
  selectedParamsTripList() {
    const queryParams = this.route.snapshot.queryParams;
    this.listQueryParams = {
      start_date: changeDateToServerFormat(queryParams['start_date']),
      end_date: changeDateToServerFormat(queryParams['end_date']),
      search: queryParams['search'],
      next_cursor: '',
      status: queryParams['selectedTab'],
      filters: queryParams['filter'],
      label : queryParams['label'],

    }
    this.getSiteInspectionList(this.listQueryParams);
  }

  getSiteInspectionList(params) {
    this.siteInspectionList=[];
    this.listQueryParams.next_cursor=''
    this._siteInspectionService.getSiteInspectionList(params).subscribe((data) => {
      this.siteInspectionList = data['result'].si;
      this.siteInspectionHeaders=data['result'].column
      params.next_cursor = data['result'].next_cursor;
    });
  }
  settingsApplied(event: boolean) {
		if (event) {
			this.listQueryParams.next_cursor = '';
			this.getSiteInspectionList(this.listQueryParams);
		}
	}

  onScroll(event) {
    const container = document.querySelector('.quotation-list');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoading && this.listQueryParams.next_cursor?.length > 0) {
      this.onScrollGetSiteInspectionList(this.listQueryParams);
    }
  }

  onScrollGetSiteInspectionList(params) {
    this.isLoading = true;
    this._siteInspectionService.getSiteInspectionList(params).subscribe(data => {
      this.siteInspectionList.push(...data['result'].si);
      params.next_cursor = data['result'].next_cursor;
      this.isLoading = false;
    })
  }
  exportList(e) {
		let companyName = localStorage.getItem('companyName');
		this._commonloaderservice.getShow();
		let queryParams = cloneDeep(this.listQueryParams)
		queryParams['export']=true
		delete queryParams['next_cursor']
		this._siteInspectionService.getSiteInspectionListExcel(queryParams).subscribe(resp => {
			let fileName;
			let type = 'xlsx'
			fileName = companyName + "_" +'Site_Inspection_List' + '.' + type;
			this._fileDownload.writeAndOpenFile(resp, fileName).then(data => {
				this._commonloaderservice.getHide();
			});
		})
	}

  trackById(item: any): string {
    return item.id;
  }

  popupFunction(data) {    
    this.siteInspectionName = data.extras.find(item => item.id == 'site_no').value;
    this.deleteSiteInspection = data.id;
    this.popupInputData['show'] = true;
  }

  confirmButton(event) {
    if (event) {
      this.commonloaderservice.getShow();
      this.apiHandler.handleRequest( this._siteInspectionService.deleteSiteInspection(this.deleteSiteInspection), ` ${this.siteInspectionName} deleted successfully!`).subscribe(
        {
          next: () => {
            this.commonloaderservice.getHide();
            this.listQueryParams.next_cursor=''
            this.getSiteInspectionList(this.listQueryParams);
            this._analytics.addEvent(this.analyticsType.DELETED,this.analyticsScreen.SITEINSPECTION,this.screenType.LIST,"Site Inspection Deleted");
            },
            error: () => {
            },
        }
      )
    }
    this.popupInputData['show'] = false;
  }

}