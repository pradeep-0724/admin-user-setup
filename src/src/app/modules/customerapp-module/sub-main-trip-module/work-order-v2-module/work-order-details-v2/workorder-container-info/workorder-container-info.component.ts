import { Component, Input, OnInit } from '@angular/core';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { WorkOrderV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/work-order-service/work-order-v2.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { ListWidgetData } from '../../../new-trip-v2/list-module-v2/list-module-v2-interface';
import { WorkOrderV2DataService } from '../../work-order-v2-dataservice.service';

@Component({
  selector: 'app-workorder-container-info',
  templateUrl: './workorder-container-info.component.html',
  styleUrls: ['./workorder-container-info.component.scss']
})
export class WorkorderContainerInfoComponent implements OnInit {

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
    this._workOrderV2Service.getWorkOrderTripInfoContainers(this.workOrderId,params).subscribe((data) => {
      this.workOrderTripInfoList=data['result'].job; 
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
    this._workOrderV2Service.getWorkOrderTripInfoContainers(this.workOrderId,params).subscribe(data=>{
      this.workOrderTripInfoList.push(...data['result'].job);
      params.next_cursor = data['result'].next_cursor;
      this.isLoading = false;
    })
  }

  isNotEmpty(any){
    return isValidValue(any)
  }


}

