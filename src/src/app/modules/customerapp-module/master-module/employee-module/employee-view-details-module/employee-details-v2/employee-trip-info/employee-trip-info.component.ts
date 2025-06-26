import { Component, Input, OnInit } from '@angular/core';
import { EmployeeDetailsService } from '../employee-details.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { cloneDeep } from 'lodash';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';

@Component({
  selector: 'app-employee-trip-info',
  templateUrl: './employee-trip-info.component.html',
  styleUrls: ['./employee-trip-info.component.scss']
})
export class EmployeeTripInfoComponent implements OnInit {

  @Input() employeeId ='';
  @Input()empDisplayName = '';
  queryParams = {
    start_date: '',
    end_date: '',
    filters: ''
  }
  customerIds=[]

  queryParamsTripList = {
    start_date: '',
    end_date: '',
    filters: '',
    next_cursor: '',
    search: ''
  }
  tripList = [];
  tripHeader = [];
  tripIsMarket = [];
  tripVehicleIds = []
  tripIds = [];
  isLoading = false;
  getPrefixUrl = getPrefix();
  tripHistoryHead: any
  currency_type: any;
  prefixUrl =getPrefix()
  constructor(private _employeeDetails:EmployeeDetailsService,private currency: CurrencyService,private _setHeight:SetHeightService,
    private _fileDownload: FileDownLoadAandOpen,private _commonloaderservice : CommonLoaderService) { }

  ngOnInit(): void {
    this.currency_type = this.currency.getCurrency();
    this._setHeight.setTableHeight('calc-height',"trip-details-table", 90)
    
  }

  filterDataFuelStas(e) {
    this.queryParams.filters = JSON.stringify(e);
    this.queryParamsTripList.filters = JSON.stringify(e);
    this.queryParamsTripList.next_cursor = '';
    this.getTripHead();
    this.getTripList();
  }
  dateRangeFuelStats(e) {
    this.queryParamsTripList.next_cursor = '';
    this.queryParams.start_date = changeDateToServerFormat(e.startDate);
    this.queryParams.end_date = changeDateToServerFormat(e.endDate);
    this.queryParamsTripList.start_date = changeDateToServerFormat(e.startDate);
    this.queryParamsTripList.end_date = changeDateToServerFormat(e.endDate);
    this.getTripHead()
    this.getTripList();
  }

  getTripHead() {
    this._employeeDetails.getEmployeeTripHead(this.employeeId, this.queryParams).subscribe(resp => {
      this.tripHistoryHead = resp['result'];
    })
  }

  searchedDataTripList(e) {
    this.queryParamsTripList.next_cursor = '';
    this.queryParamsTripList.search = e;
    this.getTripList();
  }
  settingAppliedTrip(e) {
    if (e) {
      this.queryParamsTripList.next_cursor = '';
      this.getTripList();
    }

  }

  getTripList() {
    this._employeeDetails.getEmployeeTripList(this.employeeId, this.queryParamsTripList).subscribe((data) => {
      this.tripList = data['result'].trips;
      this.tripHeader = data['result'].header;
      this.tripIds = data['result'].trip_ids;
      this.tripIsMarket= data['result'].is_market;
      this.tripVehicleIds = data['result'].vehicle_ids
      this.customerIds=data['result'].customer_ids;
      this.queryParamsTripList.next_cursor = data['result'].next_cursor;
    });
  }

  onScroll(event) {
    const container = document.querySelector('.trip_details_scroll');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoading && this.queryParamsTripList.next_cursor?.length > 0) {
      this.onScrollGetTripList(this.queryParamsTripList);
    }
  }

  onScrollGetTripList(params) {
    this.isLoading = true;
    this._employeeDetails.getEmployeeTripList(this.employeeId, params).subscribe(data => {
      this.tripList.push(...data['result'].trips);
      this.tripHeader=data['result'].header
      this.tripIds.push(...data['result'].trip_ids);
      params.next_cursor = data['result'].next_cursor;
      this.tripIsMarket.push(...data['result'].is_market);
      this.tripVehicleIds.push(...data['result'].vehicle_ids)
      this.isLoading = false;
    })
  }

  getStyle(value, index) {
    if (this.tripHeader[index].includes('Profit/Loss')) {
      if (value < 0) {
        return { color: 'red' }
      } else {
        return { color: 'rgb(43, 183, 65)' }
      }
    }

    if (this.tripHeader[index].includes('Status')) {
      if (value == 'Ongoing') {
        return { color: 'rgb(76, 172, 254)' }
      }
      if (value == 'Completed') {
        return { color: 'rgb(43, 183, 65)' }
      }
      if (value == 'Void') {
        return { color: 'red' }
      }
      if (value == 'Scheduled') {
        return { color: 'rgb(255, 185, 0)' }
      }

    }
  }

  fixedTo3Decimal(value){
    return Number(value).toFixed(3)
  }

  fileExportEvent(){
		this._commonloaderservice.getShow();
		let queryParams = cloneDeep(this.queryParams)
		queryParams['is_export']=true
		this._employeeDetails.getEmployeeTripListExport(this.employeeId,queryParams).subscribe(resp => {
			let fileName;
			let type = 'xlsx'
			fileName = this.empDisplayName + "_Job Info"  + "_" + (isValidValue(queryParams.start_date) ?  queryParams.start_date+ '_To_'+ queryParams.end_date : '') + '.' + type;
			this._fileDownload.writeAndOpenFile(resp, fileName).then(data => {
				this._commonloaderservice.getHide();
			})
		})
  }

}
