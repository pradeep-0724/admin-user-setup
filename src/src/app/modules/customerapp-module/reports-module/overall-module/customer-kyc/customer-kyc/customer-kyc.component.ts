import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { ListWidgetData } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2-interface';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';

@Component({
  selector: 'app-customer-kyc',
  templateUrl: './customer-kyc.component.html',
  styleUrls: ['./customer-kyc.component.scss']
})
export class CustomerKycComponent implements OnInit, AfterViewChecked {
  defaultParams = {
    start_date: null,
    end_date: null,
    search: '',
    next_cursor:'',
  };
  kycList=[]
  prefixUrl=getPrefix();
  scrollFlag=false;
  constructor(private _setTableHeight: SetHeightService, private _partyService: PartyService) { }

  ngOnInit(): void {
    this.getPartyKyc();
  }
  ngAfterViewChecked(): void {
    this._setTableHeight.setTableHeight2(['.calc-height'], 'kyc-report-table', 0)

  }

  listWidgetData(widgetData: ListWidgetData) {
    this.defaultParams =
    {
      start_date:widgetData.dateRange.startDate?changeDateToServerFormat(new Date(widgetData.dateRange.startDate).toDateString()):null,
      end_date:widgetData.dateRange.endDate?changeDateToServerFormat(new Date(widgetData.dateRange.endDate).toDateString()):null,
      search: widgetData.searchValue,
      next_cursor:'',
    }
    this.getPartyKyc();
  }

  getPartyKyc() {
    this._partyService.getKycPartyList(this.defaultParams).subscribe(resp => {
      this.kycList= resp['result']['parties']
      this.defaultParams.next_cursor=resp['result']['next_cursor']
    })
  }

  scrollEvent(){
    const container = document.querySelector('#kyc-report-table');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10)&& !this.scrollFlag && this.defaultParams.next_cursor?.length > 0) {
        this.getPartyKycOnscroll(this.defaultParams)
    }
  }

  getPartyKycOnscroll(listQueryPrams){
    this.scrollFlag=true;
    this._partyService.getKycPartyList(listQueryPrams).subscribe((data:any)=>{
      this.scrollFlag=false
      this.kycList.push(...data['result']['parties']);
       listQueryPrams.next_cursor=data['result']['next_cursor'];
    })
  }



}
