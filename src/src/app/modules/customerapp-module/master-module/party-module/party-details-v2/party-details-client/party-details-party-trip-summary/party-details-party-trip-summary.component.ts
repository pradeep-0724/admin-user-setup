import { Component, Input, OnInit } from '@angular/core';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { PartyDetailsClientService } from '../party-details-client.service';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { cloneDeep } from 'lodash';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';

@Component({
  selector: 'app-party-details-party-trip-summary',
  templateUrl: './party-details-party-trip-summary.component.html',
  styleUrls: ['./party-details-party-trip-summary.component.scss']
})
export class PartyDetailsPartyTripSummaryComponent implements OnInit {

  @Input() partyId = '';
  @Input() partInfoDetails: any;
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
  tripIsMarket = [];
  tripVehicleIds = [];
  isLoading = false;
  getPrefixUrl = getPrefix();
  tripHistoryHead: any
  currency_type: any;
  prefixUrl =getPrefix()
  constructor(private _setTableHeight:SetHeightService, private _partyDetailsClientService: PartyDetailsClientService, private currency: CurrencyService,
    private _commonloaderservice : CommonLoaderService,private _fileDownload : FileDownLoadAandOpen) { }

  ngOnInit(): void {
    this.currency_type = this.currency.getCurrency();
    this._setTableHeight.setTableHeight('calc-height',"trip-details-table", 100)


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
    this._partyDetailsClientService.getTripHead(this.partyId, this.queryParams).subscribe(resp => {
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
    this._partyDetailsClientService.getTripList(this.partyId, this.queryParamsTripList).subscribe((data) => {
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
    this._partyDetailsClientService.getTripList(this.partyId, params).subscribe(data => {
      this.tripList.push(...data['result'].trips);
      params.next_cursor = data['result'].next_cursor;
      this.isLoading = false;
    })
  }

  getStyle(value,id) {
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
    if(id==='profit_loss'){
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

  fileExportEventForJobCard(){
		this._commonloaderservice.getShow();
		let queryParams = cloneDeep(this.queryParamsTripList)
		queryParams['is_export']=true;
    queryParams['next_cursor']='';
		this._partyDetailsClientService.getTripListForExport(this.partyId,queryParams).subscribe(resp => {
			let fileName;
			let type = 'xlsx'      
			fileName = this.partInfoDetails?.company_name + "_Job Summary_" + (isValidValue(queryParams.start_date) ?  queryParams.start_date+ '_To_'+ queryParams.end_date : '') + '.' + type;
			this._fileDownload.writeAndOpenFile(resp, fileName).then(data => {        
				this._commonloaderservice.getHide();
      });
		})
  }
}
