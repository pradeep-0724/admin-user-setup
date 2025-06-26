import { Component, Input, OnInit } from '@angular/core';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { WorkOrderV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/work-order-service/work-order-v2.service';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { WorkOrderV2DataService } from '../../work-order-v2-dataservice.service';
@Component({
  selector: 'app-work-order-cargo-job-info',
  templateUrl: './work-order-cargo-job-info.component.html',
  styleUrls: ['./work-order-cargo-job-info.component.scss']
})
export class WorkOrderCargoJobInfoComponent implements OnInit {
  @Input() workOrderId:string;
  defalultJobPrams = {
    search: '',
    next_cursor: ''
  }
  jobList = [];
  jobHeaderList = [];
  isLoading=false;
  prefix = getPrefix();


  constructor(private _workOrderV2Service: WorkOrderV2Service,private _workOrderDataService : WorkOrderV2DataService) { }
  

  ngOnInit(): void {
    this._workOrderDataService.updateWorkOrderDetails.subscribe((result:boolean)=>{      
      if(result){
        this.getJobsList()
      }
    })
    this.getJobsList()
  }
  isNotEmpty(any){
    return isValidValue(any)
  }
  getJobsList() {
    this._workOrderV2Service.getSOCargoJobInfo(this.workOrderId, this.defalultJobPrams).subscribe(resp => {
      this.jobHeaderList=resp['result'].header;
      this.jobList = resp['result'].trips;
      this.defalultJobPrams.next_cursor = resp['result'].next_cursor
      
    })

  }

  
  settingsApplied(e) {
    if (e)
      this.getJobsList()
  }
  searchJobList(e) {
    this.defalultJobPrams.search = e;
    this.defalultJobPrams.next_cursor = '';
    this.getJobsList();
  }
  onScrollJob(e) {
    const container = document.querySelector('.job-class');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoading && this.defalultJobPrams.next_cursor?.length > 0) {
      this.onScrollJobList(this.defalultJobPrams);
    }
  }
  onScrollJobList(params) {
    this.isLoading = true;
    this._workOrderV2Service.getSOCargoJobInfo(this.workOrderId, params).subscribe(resp => {
      this.jobList.push(...resp['result'].trips);
      params.next_cursor = resp['result'].next_cursor
      this.isLoading = false;
    })
  }

}
