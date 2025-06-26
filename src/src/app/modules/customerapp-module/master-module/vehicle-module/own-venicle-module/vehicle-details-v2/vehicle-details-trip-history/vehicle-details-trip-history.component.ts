import { Component, Input, OnInit } from '@angular/core';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { VehicleDetailsV2Service } from '../../../../../api-services/master-module-services/vehicle-services/vehicle-details-v2.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { cloneDeep } from 'lodash';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';

@Component({
  selector: 'app-vehicle-details-trip-history',
  templateUrl: './vehicle-details-trip-history.component.html',
  styleUrls: ['./vehicle-details-trip-history.component.scss']
})
export class VehicleDetailsTripHistoryComponent implements OnInit {
  @Input() vehicleId = '';
  @Input() vehicleHeaderDetails:any;
  queryParams = {
    start_date: '',
    end_date: '',
    filters: ''
  }
  customerIds=[];
  queryParamsTripList = {
    start_date: '',
    end_date: '',
    filters: '',
    next_cursor: '',
    search: ''
  }
  tripList = [];
  tripHeader = [];
  isLoading = false;
  getPrefixUrl = getPrefix();
  tripHistoryHead: any
  currency_type: any;
  filterUrl = ''
  constructor(private _setHeight:SetHeightService, private _vehicleDetailsV2Service: VehicleDetailsV2Service, private currency: CurrencyService,
    private _fileDownload: FileDownLoadAandOpen,private _commonloaderservice : CommonLoaderService) { }

  ngOnInit(): void {
    this.filterUrl = 'report/vehicle/trip/filters/'+ this.vehicleId+'/';
    this.currency_type = this.currency.getCurrency();
    this._setHeight.setTableHeight("calc-height","trip-status-list",100)
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
    this._vehicleDetailsV2Service.getVehicleTripHead(this.vehicleId, this.queryParams).subscribe(resp => {
      this.tripHistoryHead = resp['result']
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
    this._vehicleDetailsV2Service.getVehicleTripList(this.vehicleId, this.queryParamsTripList).subscribe((data) => {
      this.tripList = data['result'].trips;
      this.tripHeader = data['result'].header;
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
    this._vehicleDetailsV2Service.getVehicleTripList(this.vehicleId, params).subscribe(data => {
      this.tripList.push(...data['result'].trips);
      this.tripHeader=data['result'].header;
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

  fileExportEvent(){
		this._commonloaderservice.getShow();
		let queryParams = cloneDeep(this.queryParams)
		queryParams['is_export']=true
		this._vehicleDetailsV2Service.getVehicleTripListExport(this.vehicleId,queryParams).subscribe(resp => {
			let fileName;
			let type = 'xlsx'      
			fileName = this.vehicleHeaderDetails.reg_number + "_Job History"  + "_" + (isValidValue(queryParams.start_date) ?  queryParams.start_date+ '_To_'+ queryParams.end_date : '') + '.' + type;
			this._fileDownload.writeAndOpenFile(resp, fileName).then(data => {        
				this._commonloaderservice.getHide();
      });
		})
  }
 


}
