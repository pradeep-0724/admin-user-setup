import { Component, Input, OnInit } from '@angular/core';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { VehicleDetailsV2Service } from '../../../../../api-services/master-module-services/vehicle-services/vehicle-details-v2.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';

@Component({
  selector: 'app-vehicle-details-fuel-history-section',
  templateUrl: './vehicle-details-fuel-history-section.component.html',
  styleUrls: ['./vehicle-details-fuel-history-section.component.scss']
})
export class VehicleDetailsFuelHistorySectionComponent implements OnInit {
  @Input() vehicleId = '';
  fuelHeaderDetails: any
  currency_type: any

  constructor(private _vehicleDetailsV2Service: VehicleDetailsV2Service, private currency: CurrencyService) { }
  getPrefixUrl = getPrefix();
  queryParamsFuelHeader = {
    start_date: '',
    end_date: '',
  }

  queryParamsFuelIn = {
    start_date: '',
    end_date: '',
    filters: '',
    next_cursor: '',
    search: ''
  }
  queryParamsFuelOut = {
    start_date: '',
    end_date: '',
    next_cursor: '',
    search: ''
  }
  fuelInList = [];
  fuelOutList = [];
  isLoading = false;
  isLoadingFuelOut = false;
  ngOnInit(): void {
    this.currency_type = this.currency.getCurrency();

  }
  getFuelHistoryHeaderSection() {
    this._vehicleDetailsV2Service.getVehicleFuelHeader(this.vehicleId, this.queryParamsFuelHeader).subscribe(resp => {
      this.fuelHeaderDetails = resp['result']
    });
  }

  dateRangeFuelStats(e) {
    this.queryParamsFuelHeader.start_date = changeDateToServerFormat(e.startDate);
    this.queryParamsFuelHeader.end_date = changeDateToServerFormat(e.endDate);
    this.getFuelHistoryHeaderSection()
  }


  getFuelInData() {
    this._vehicleDetailsV2Service.getVehicleFuelInTableData(this.vehicleId, this.queryParamsFuelIn).subscribe(resp => {
      this.fuelInList = resp['result'].data;
      this.queryParamsFuelIn.next_cursor = resp['result'].next_cursor
    });
  }

  dateRangeFuelIn(e) {
    this.queryParamsFuelIn.next_cursor = ''
    this.queryParamsFuelIn.start_date = changeDateToServerFormat(e.startDate);
    this.queryParamsFuelIn.end_date = changeDateToServerFormat(e.endDate);
    this.getFuelInData();
  }

  filterDataFuelIn(e) {
    this.queryParamsFuelIn.filters = JSON.stringify(e);
    this.queryParamsFuelIn.next_cursor = '';
    this.getFuelInData();
  }

  searchedDataFuelIn(e) {
    this.queryParamsFuelIn.search = e;
    this.queryParamsFuelIn.next_cursor = '';
    this.getFuelInData();
  }

  onScroll(event) {
    const container = document.querySelector('.fuel-in-table');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoading && this.queryParamsFuelIn.next_cursor?.length > 0) {
      this.onScrollFuelIn(this.queryParamsFuelIn);
    }
  }

  onScrollFuelIn(params) {
    this.isLoading = true;
    this._vehicleDetailsV2Service.getVehicleFuelInTableData(this.vehicleId, params).subscribe(data => {
      this.fuelInList.push(...data['result'].trips);
      params.next_cursor = data['result'].next_cursor;
      this.isLoading = false;
    })
  }

  dateRangeFuelOut(e) {
    this.queryParamsFuelOut.next_cursor = ''
    this.queryParamsFuelOut.start_date = changeDateToServerFormat(e.startDate);
    this.queryParamsFuelOut.end_date = changeDateToServerFormat(e.endDate);
    this.getFuelOutData();
  }

  searchedDataFuelOut(e) {
    this.queryParamsFuelOut.search = e;
    this.queryParamsFuelOut.next_cursor = '';
    this.getFuelOutData();
  }

  getFuelOutData() {
    this._vehicleDetailsV2Service.getVehicleFuelOutTableData(this.vehicleId, this.queryParamsFuelOut).subscribe(resp => {
      this.fuelOutList = resp['result'].data
      this.queryParamsFuelOut.next_cursor = resp['result'].next_cursor
    });
  }

  scrollFuelOut(event) {
    const container = document.querySelector('.fuel-out-table');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoadingFuelOut && this.queryParamsFuelOut.next_cursor?.length > 0) {
      this.onScrollFuelOut(this.queryParamsFuelOut);
    }
  }

  onScrollFuelOut(params) {
    this.isLoadingFuelOut = true;
    this._vehicleDetailsV2Service.getVehicleFuelInTableData(this.vehicleId, params).subscribe(data => {
      this.fuelOutList.push(...data['result'].trips);
      params.next_cursor = data['result'].next_cursor;
      this.isLoadingFuelOut = false;
    })
  }

  fixedTo3Decimal(value){
    return Number(value).toFixed(3)
   }





}
