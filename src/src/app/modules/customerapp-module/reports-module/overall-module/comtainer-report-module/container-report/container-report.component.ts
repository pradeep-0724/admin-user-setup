import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { DropDownType, ListWidgetData } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2-interface';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { ContainerReportService } from '../container-report-service.service';

@Component({
  selector: 'app-container-report',
  templateUrl: './container-report.component.html',
  styleUrls: ['./container-report.component.scss'],
  host: {
    '(document:click)': 'outSideClick($event)'
  }
})
export class ContainerReportComponent implements OnInit {
  listUrl = '/reports/overall/container-report'
  filterUrl = 'revenue/workorder/container/report/filter/'
  settingsUrl = 'revenue/trip/workorder/container/report/setting/'
  showOptions:any;
  defaultParams = {
    start_date: null,
    end_date: null,
    next_cursor: '',
    search: '',
    status: '0',
    filters: [],
    label: ''
  };
  listQueryParams = {
    start_date: '',
    end_date: '',
    next_cursor: '',
    status: '0',
    search: '',
    filters: [],
    label: ''
  }
  containerList = [];
  containerHeaders = []
  isLoading = false;
  prefixUrl = getPrefix();
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  analyticsType = OperationConstants;
  tabSelectionList: Array<DropDownType> = [
    {
      label: "Ongoing Containers",
      value: "0",
    },
    {
      label: "Completed Containers",
      value: "1",
    },
    {
      label: "All Containers",
      value: "2",
    }
  ];
  constructor(
    private _analytics: AnalyticsService, private commonloaderservice: CommonLoaderService, private router: Router,
    private route: ActivatedRoute, private _setHeight: SetHeightService,
    private _containerReportService: ContainerReportService
  ) { }

  ngOnInit(): void {
    this.commonloaderservice.getHide();
    this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.CONTAINER, this.screenType.LIST, "Navigated");
    this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('selectedTab')) {
        this.selectedParamsContainerList()
      } else {
        this.listQueryParams = cloneDeep(this.defaultParams)
        this.getContainerList(this.listQueryParams);
      }
    });
  }

  ngOnDestroy(): void {
    this.commonloaderservice.getShow();
  }
  ngAfterViewChecked(): void {
    this._setHeight.setTableHeight2(['.calc-height'], "container-list", 0)
  }
  optionsList(list_index) {
    return this.showOptions = list_index;
  }

  listWidgetData(widgetData: ListWidgetData) {
    let queryParams = new Object(
      {
        start_date: widgetData.dateRange.startDate,
        end_date: widgetData.dateRange.endDate,
        search: widgetData.searchValue,
        filter: JSON.stringify(widgetData.filterKeyData),
        selectedTab: widgetData.tabSelection,
        label: widgetData.dateRange.selectedOpt
      }
    );
    this.router.navigate([getPrefix() + this.listUrl], { queryParams });
  }

  settingsApplied(event: boolean) {
    if (event) {
      this.listQueryParams.next_cursor = '';
      this.getContainerList(this.listQueryParams);
    }
  }

  selectedParamsContainerList() {
    const queryParams = this.route.snapshot.queryParams;
    this.listQueryParams = {
      start_date: changeDateToServerFormat(queryParams['start_date']),
      end_date: changeDateToServerFormat(queryParams['end_date']),
      search: queryParams['search'],
      status: queryParams['selectedTab'],
      next_cursor: '',
      filters: queryParams['filter'],
      label: queryParams['label'],

    }
    this.getContainerList(this.listQueryParams);
  }

  getContainerList(params) {
    this.containerList = [];
    this.listQueryParams.next_cursor = ''
    this._containerReportService.getContainerReport(params).subscribe((data) => {
      this.containerList = data['result'].cr;
      this.containerHeaders = data['result'].column;
      params.next_cursor = data['result'].next_cursor;
    });
  }

  onScroll(event) {
    const container = document.querySelector('.container-list');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoading && this.listQueryParams.next_cursor?.length > 0) {
      this.onScrollGetContainerList(this.listQueryParams);
    }
  }

  onScrollGetContainerList(params) {
    this.isLoading = true;
    this._containerReportService.getContainerReport(params).subscribe(data => {
      this.containerList.push(...data['result'].cr);
      params.next_cursor = data['result'].next_cursor;
      this.isLoading = false;
    })
  }

  trackById(item: any): string {
    return item.id;
  }
  
  convertToJob(data,operationType){
    let queryParams = {
      workOrderId:data.workorder_id,
      operationType:operationType,
      billingType:data.is_job_wise?'10':'11',
      movementType :data.type_of_movement,
      scopeOfWork :data.movement_sow,
      canShowToken :data.has_token_vgm,
      containerId:data.id,
      fromContainerReport:true
    };
    this.router.navigate([getPrefix()+'/trip/work-order/details/assign-job'],{ queryParams })
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

}
