import { Component, OnInit } from '@angular/core';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { VehicleTypeReportService } from '../vehicle-type-report.service';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { formatNumber } from 'src/app/shared-module/pipes/numberformat.pipe';

@Component({
  selector: 'app-vehicle-type-report',
  templateUrl: './vehicle-type-report.component.html',
  styleUrls: ['./vehicle-type-report.component.scss']
})
export class VehicleTypeReportComponent implements OnInit {
  queryParams = {
    start_date: '',
    end_date: '',
    filters: '' 
  }

  queryParamsTripList = {
    start_date: '',
    end_date: '',
    filters: '',
    next_cursor: '',
    search: ''
  }
  tripList = [];
  tripHeader = [];
  tripIds = [];
  isLoading = false;
  getPrefixUrl = getPrefix();
  tripHistoryHead: any
  currency_type: any
  constructor(private _setHeight:SetHeightService, private vehicletypeservice: VehicleTypeReportService, private currency: CurrencyService) { }

  ngOnInit(): void {
    this.currency_type = this.currency.getCurrency();
    this._setHeight.setTableHeight2([".calc-height",".calc-h-veh-type-info"],"vehicle-type-details-list",110)
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
    this.vehicletypeservice.getVehicleTypeReportHead(this.queryParams).subscribe(resp => {
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
    this.vehicletypeservice.getVehicleTypeReportList( this.queryParamsTripList).subscribe((data) => {            
      this.tripList = data['result'].v_trips;
      this.tripHeader = data['result'].header;
      this.tripIds = data['result'].model_ids;
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
    this.vehicletypeservice.getVehicleTypeReportList( params).subscribe(data => {
      this.tripList.push(...data['result'].v_trips);
      this.tripHeader=data['result'].header
      this.tripIds.push(...data['result'].model_ids);
      params.next_cursor = data['result'].next_cursor;
      this.isLoading = false;
    })
  }
  fixedTo3Decimal(value){
    return formatNumber(Number(Number(value).toFixed(3)))
   }


}
