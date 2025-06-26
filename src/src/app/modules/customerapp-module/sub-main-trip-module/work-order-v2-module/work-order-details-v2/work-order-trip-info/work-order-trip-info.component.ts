import { Component, Input, OnInit } from '@angular/core';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { ListWidgetData } from '../../../new-trip-v2/list-module-v2/list-module-v2-interface';
import { WorkOrderV2Service } from '../../../../api-services/trip-module-services/work-order-service/work-order-v2.service';
import {  changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { WorkOrderV2DataService } from '../../work-order-v2-dataservice.service';
// import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
// const today = new Date(dateWithTimeZone());
@Component({
  selector: 'app-work-order-trip-info',
  templateUrl: './work-order-trip-info.component.html',
  styleUrls: ['./work-order-trip-info.component.scss']
})
export class WorkOrderTripInfoComponent implements OnInit {
  
  workOrderTripInfoList = [];
  prefixUrl = getPrefix();
  defaultParams = {
    start_date:null,
    end_date: null,
    next_cursor: '',
    search:'',
    filters:'',
    label : ''
  };
  listQueryParams={
    start_date: null,
    end_date: null,
    next_cursor: '',
    search:'',
    filters:'',
    label : ''
  };
  workOrderTripInfoHeader = [];
  isLoading =false;
  settingsUrl = 'revenue/workorder/others/setting/'
  @Input() workOrderId:string
  @Input() workOrderDetail:any

 
  constructor(private _workOrderV2Service:WorkOrderV2Service,private _workOrderDataService : WorkOrderV2DataService) {}

  ngOnDestroy(): void {
  }

  ngOnInit(): void {    
    this.getWorkOrderTripInfoList(this.defaultParams)
    this._workOrderDataService.updateWorkOrderDetails.subscribe((result:boolean)=>{      
      if(result){
        this.getWorkOrderTripInfoList(this.defaultParams)
      }
    })
  }

 

  listWidgetData(widgetData: ListWidgetData) {
    this.listQueryParams =
      {
        start_date: changeDateToServerFormat(String(widgetData.dateRange.startDate)),
        end_date: changeDateToServerFormat(String(widgetData.dateRange.endDate)),
        search:widgetData.searchValue,
        filters:JSON.stringify(widgetData.filterKeyData),
        next_cursor:'',
        label : widgetData.dateRange.selectedOpt
      }
    this.getWorkOrderTripInfoList(this.listQueryParams)
  }

  getWorkOrderTripInfoList(params){
    this._workOrderV2Service.getWorkOrderTripInfo(this.workOrderId,params).subscribe((data) => {
      this.workOrderTripInfoList=data['result'].trips; 
      this.workOrderTripInfoHeader=data['result'].header; 
      this.listQueryParams.next_cursor=data['result'].next_cursor;
    });
   }

   trackById(item: any): string {
		return item.id;
	  }

   settingsApplied(event: boolean) {
    if (event) {
      this.listQueryParams.next_cursor = '';
      this.getWorkOrderTripInfoList(this.listQueryParams);
    }
  }

   onScroll(event) {
    const container = document.querySelector('.table-wrapper-list');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10)&& !this.isLoading && this.listQueryParams.next_cursor?.length > 0) {
       this.onScrollGetworkOrderTripInfoList(this.listQueryParams);
    }
  }


  onScrollGetworkOrderTripInfoList(params){
    this.isLoading = true;
    this._workOrderV2Service.getWorkOrderTripInfo(this.workOrderId,params).subscribe(data=>{
      this.workOrderTripInfoList.push(...data['result'].trips);
      params.next_cursor = data['result'].next_cursor;
      this.isLoading = false;
    })
  }
  isNotEmpty(any){
    return isValidValue(any)
  }


}
