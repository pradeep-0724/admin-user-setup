import { Component, Input, OnInit } from '@angular/core';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { AssetsDetailsService } from 'src/app/modules/customerapp-module/api-services/master-module-services/assets-service/assets-details.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';

@Component({
  selector: 'app-assets-job-history',
  templateUrl: './assets-job-history.component.html',
  styleUrls: ['./assets-job-history.component.scss']
})
export class AssetsJobHistoryComponent implements OnInit {
  
  @Input() assetId = ''
  queryParamsJobList = {
    start_date: '',
    end_date: '',
    next_cursor: '',
    search: ''
  }
  jobList = [];
  jobHeader = [];
  isLoading = false;
  getPrefixUrl = getPrefix();
  currency_type: any;

  constructor(private _setHeight:SetHeightService, private _assetDetailsService:AssetsDetailsService, private currency: CurrencyService) { }

  ngOnInit(): void {
    this.currency_type = this.currency.getCurrency();
    this._setHeight.setTableHeight("calc-height","trip-status-list",100);
  }

  dateRangeSelected(e) {    
    this.queryParamsJobList.next_cursor = '';
    this.queryParamsJobList.start_date = changeDateToServerFormat(e.startDate);
    this.queryParamsJobList.end_date = changeDateToServerFormat(e.endDate);
    this.getJobHistoryList();
  }

  searchedDataJobList(e) {
    this.queryParamsJobList.next_cursor = '';
    this.queryParamsJobList.search = e;
    this.getJobHistoryList();
  }

  settingAppliedTrip(e) {
    if (e) {
      this.queryParamsJobList.next_cursor = '';
      this.getJobHistoryList();
    }
  }

  getJobHistoryList() {
    this._assetDetailsService.getAssignedAssetsInJobs(this.assetId, this.queryParamsJobList).subscribe((data) => {      
      this.jobList = data['result'].trips;
      this.jobHeader = data['result'].header;
      this.queryParamsJobList.next_cursor = data['result'].next_cursor;
    });
  }

  onScroll(event) {
    const container = document.querySelector('.trip_details_scroll');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoading && this.queryParamsJobList.next_cursor?.length > 0) {
      this.onScrollGetJobList(this.queryParamsJobList);
    }
  }

  onScrollGetJobList(params) {
    this.isLoading = true;
    this._assetDetailsService.getAssignedAssetsInJobs(this.assetId, params).subscribe(data => {
      this.jobList.push(...data['result'].trips);
      this.jobHeader=data['result'].header;
      params.next_cursor = data['result'].next_cursor;
      this.isLoading = false;
    })
  }

  getStyle(value, id) {
    if (value == 'Ongoing') {
      return { color: 'rgb(76, 172, 254)' }
    }
    if (value == 'Completed') {
      return { color: 'rgb(43, 183, 65)' }
    }
    if (value == 'Scheduled') {
      return { color: 'rgb(255, 185, 0)' }
    }
    if (value == 'Void') {
      return { color: 'red' }
    }
    if(id =='profit_loss_value'){
      if (value < 0) {
        return { color: 'red' }
      } else {
        return { color: 'rgb(43, 183, 65)' }
      }
  
    }
  }

  fixedTo3Decimal(value){
    return Number(value).toFixed(3)
   }
 


}
