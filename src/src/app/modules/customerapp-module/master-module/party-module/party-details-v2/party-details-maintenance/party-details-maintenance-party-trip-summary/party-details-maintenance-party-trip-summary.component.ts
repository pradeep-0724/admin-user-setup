import { Component, Input, OnInit } from '@angular/core';
import { PartyMaintenanceService } from '../party-maintenance-service.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { SetHeightService } from 'src/app/core/services/set-height.service';

@Component({
  selector: 'app-party-details-maintenance-party-trip-summary',
  templateUrl: './party-details-maintenance-party-trip-summary.component.html',
  styleUrls: ['./party-details-maintenance-party-trip-summary.component.scss']
})
export class PartyDetailsMaintenancePartyTripSummaryComponent implements OnInit {
  @Input() partyId =''
  queryParamsMaintenanceHead = {
    start_date: '',
    end_date: '',
  }

  queryParamsMaintenanceSummary = {
    start_date: '',
    end_date: '',
    next_cursor: '',
    search: ''
  }
  maintenanceStat;
  currency_type: any
  serviceSummaryList=[];
  isLoading = false;
  getPrefixUrl = getPrefix();
  isTax = false;
  constructor(private _setHeight:SetHeightService, private _partyMaintenanceService:PartyMaintenanceService,private currency: CurrencyService,private _tax: TaxService,) { }

  ngOnInit(): void {
    this.isTax = this._tax.getTax();
    this.currency_type = this.currency.getCurrency();
    this._setHeight.setTableHeight("calc-height","service-summary-table",130)
  }

  getFuelHead(){
    this._partyMaintenanceService.getFuelVendorMaintenanceSummaryHead(this.partyId,this.queryParamsMaintenanceHead).subscribe(resp=>{
      this.maintenanceStat = resp['result']
    })
  }

  dateRangeMaintenanceStat(e){
    this.queryParamsMaintenanceHead.start_date = changeDateToServerFormat(e.startDate);
    this.queryParamsMaintenanceHead.end_date = changeDateToServerFormat(e.endDate);
    this.getFuelHead();
  }

  searchedDataMaintenanceSummary(e){
    this.queryParamsMaintenanceSummary.next_cursor ='';
    this.queryParamsMaintenanceSummary.search =e;
    this.getServiceSummary();
  }

  dateRangeMaintenanceSummary(e){
    this.queryParamsMaintenanceSummary.next_cursor ='';
    this.queryParamsMaintenanceSummary.start_date = changeDateToServerFormat(e.startDate);
    this.queryParamsMaintenanceSummary.end_date = changeDateToServerFormat(e.endDate);
    this.getServiceSummary();
  }

  getServiceSummary(){
    this._partyMaintenanceService.getFuelVendorMaintenanceSummary(this.partyId,this.queryParamsMaintenanceSummary).subscribe(resp=>{
      this.serviceSummaryList = resp['result'].jobcards;
      this.queryParamsMaintenanceSummary.next_cursor =resp['result'].next_cursor;
    })
  }

  onScroll(event) {
    const container = document.querySelector('.maintenance_scroll');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoading && this.queryParamsMaintenanceSummary.next_cursor?.length > 0) {
      this.onScrollGetFuelSummary(this.queryParamsMaintenanceSummary);
    }
  }

  onScrollGetFuelSummary(params) {
    this.isLoading = true;
    this._partyMaintenanceService.getFuelVendorMaintenanceSummary(this.partyId, params).subscribe(resp => {
      this.serviceSummaryList.push(...resp['result'].jobcards);
      params.next_cursor = resp['result'].next_cursor;
      this.isLoading = false;
    })
  }
  fixedTo3Decimal(value){
    return Number(value).toFixed(3)
   }

}
