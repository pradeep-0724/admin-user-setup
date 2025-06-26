import { Component, Input, OnInit } from '@angular/core';
import { PartyDetailsVendorCommonService } from '../../party-details-vendor-common-service.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';

@Component({
  selector: 'app-party-details-fuel-provider-summary',
  templateUrl: './party-details-fuel-provider-summary.component.html',
  styleUrls: ['./party-details-fuel-provider-summary.component.scss']
})
export class PartyDetailsFuelProviderSummaryComponent implements OnInit {
  @Input() partyId =''
  queryParamsFuelHead = {
    start_date: '',
    end_date: '',
  }

  queryParamsFuelSummary = {
    start_date: '',
    end_date: '',
    next_cursor: '',
    search: ''
  }
  fuelStats;
  currency_type: any
  fuelSummaryList=[];
  isLoading = false;
  prefixUrl= getPrefix()
  constructor(private _partyDetailsVendorCommonService:PartyDetailsVendorCommonService,private currency: CurrencyService) { }

  ngOnInit(): void {
    this.currency_type = this.currency.getCurrency();
  }

  getFuelHead(){
    this._partyDetailsVendorCommonService.getFuelVendorFuelSummaryHead(this.partyId,this.queryParamsFuelHead).subscribe(resp=>{
      this.fuelStats = resp['result']
    })
  }

  dateRangeFuelStat(e){
    this.queryParamsFuelHead.start_date = changeDateToServerFormat(e.startDate);
    this.queryParamsFuelHead.end_date = changeDateToServerFormat(e.endDate);
    this.getFuelHead();
  }

  searchedDataFuelSummary(e){
    this.queryParamsFuelSummary.next_cursor ='';
    this.queryParamsFuelSummary.search =e;
    this.getFuelSummary();
  }

  dateRangeFuelSummary(e){
    this.queryParamsFuelSummary.next_cursor ='';
    this.queryParamsFuelSummary.start_date = changeDateToServerFormat(e.startDate);
    this.queryParamsFuelSummary.end_date = changeDateToServerFormat(e.endDate);
    this.getFuelSummary();
  }

  getFuelSummary(){
    this._partyDetailsVendorCommonService.getFuelVendorFuelSummary(this.partyId,this.queryParamsFuelSummary).subscribe(resp=>{
      this.fuelSummaryList = resp['result'].data;
      this.queryParamsFuelSummary.next_cursor =resp['result'].next_cursor;
    })
  }

  onScroll(event) {
    const container = document.querySelector('.fuel_scroll');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoading && this.queryParamsFuelSummary.next_cursor?.length > 0) {
      this.onScrollGetFuelSummary(this.queryParamsFuelSummary);
    }
  }

  onScrollGetFuelSummary(params) {
    this.isLoading = true;
    this._partyDetailsVendorCommonService.getFuelVendorFuelSummary(this.partyId, params).subscribe(resp => {
      this.fuelSummaryList.push(...resp['result'].data);
      params.next_cursor = resp['result'].next_cursor;
      this.isLoading = false;
    })
  }

  fixedTo3Decimal(value){
    return Number(value).toFixed(3)
   }

}
