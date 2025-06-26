import { Component, OnDestroy, OnInit } from '@angular/core';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { SalesByCustomerService } from '../../../../api-services/reports-module-services/revenue-service/sales-by-customer.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { formatNumber } from 'src/app/shared-module/pipes/numberformat.pipe';

@Component({
  selector: 'app-sales-by-customer-info',
  templateUrl: './sales-by-customer-info.component.html',
  styleUrls: ['./sales-by-customer-info.component.scss']
})
export class SalesByCustomerInfoComponent implements OnInit,OnDestroy {
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
  constructor(private _setHeight:SetHeightService, private salesbyCustomerService: SalesByCustomerService, private currency: CurrencyService,private commonloaderservice :CommonLoaderService) { }

  ngOnDestroy(): void {
    this.commonloaderservice.getShow();
  }

  ngOnInit(): void {
    this.commonloaderservice.getHide()
    this.currency_type = this.currency.getCurrency();
    this._setHeight.setTableHeight("calc-height","customer-details-table",100)

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
    this.salesbyCustomerService.getsalesByCustomerReportHead(this.queryParams).subscribe(resp => {
      console.log(resp);
      
      this.tripHistoryHead = resp['result']      
      
    })
  }

  searchedDataTripList(e) {
    this.queryParamsTripList.next_cursor = '';
    this.queryParamsTripList.search = e;
    this.getTripList();
  }
 

  getTripList() {
    this.salesbyCustomerService.getsalesByCustomerReportList( this.queryParamsTripList).subscribe((data) => {                  
      this.tripList = data['result'].clients;
      this.tripHeader = data['result'].header;
      this.tripIds = data['result'].clients_ids;
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
    this.salesbyCustomerService.getsalesByCustomerReportHead( params).subscribe(data => {
      this.tripList.push(...data['result'].clients);
      this.tripHeader=data['result'].header
      this.tripIds.push(...data['result'].clients_ids);
      params.next_cursor = data['result'].next_cursor;
      this.isLoading = false;
    })
  }

  fixedTo3Decimal(value){
    return formatNumber(Number(Number(value).toFixed(3)))
   }


}
