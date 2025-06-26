import { Component, OnInit } from '@angular/core';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { OverallTripReportService } from '../overall-trip-report.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { SetHeightService } from 'src/app/core/services/set-height.service';

@Component({
  selector: 'app-overall-trip-report-clients-trip-info',
  templateUrl: './overall-trip-report-clients-trip-info.component.html',
  styleUrls: ['./overall-trip-report-clients-trip-info.component.scss']
})
export class OverallTripReportClientsTripInfoComponent implements OnInit {
  queryParams = {
    start_date: '',
    end_date: '',
    filters: '' 
  }
  clientIds=[];

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
  constructor(private _setHeight:SetHeightService, private _overallTripReportService: OverallTripReportService, private currency: CurrencyService) { }

  ngOnInit(): void {
    this.currency_type = this.currency.getCurrency();
    this._setHeight.setTableHeight2([".calc-height",".calc-height-clients-trip-info"],"overall-clients-trips-list",115)
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
    this._overallTripReportService.getOverallTripReportClientHead(this.queryParams).subscribe(resp => {
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
    this._overallTripReportService.getOverallTripReportClientList( this.queryParamsTripList).subscribe((data) => {      
      this.tripList = data['result'].client_trips;
      this.tripHeader = data['result'].header;
      this.clientIds = data['result'].client_ids;
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
    this._overallTripReportService.getOverallTripReportClientList( params).subscribe(data => {
      this.tripList.push(...data['result'].client_trips);
      this.tripHeader=data['result'].header
      this.tripIds.push(...data['result'].client_ids);
      params.next_cursor = data['result'].next_cursor;
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
      if (value == 'Scheduled') {
        return { color: 'rgb(255, 185, 0)' }
      }

    }
  }
  fixedTo3Decimal(value){
    return Number(value).toFixed(3)
   }



}

